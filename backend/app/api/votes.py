"""Votes API — casting, verification, and double-vote protection."""

import uuid
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_optional_current_user
from app.models.user import User, UserRole
from app.models.vote import Vote
from app.models.voter import Voter, VoterStatus
from app.models.candidate import Candidate
from app.models.election import Election, ElectionStatus
from app.models.audit import AuditRecord, AuditEventType
from app.schemas.vote import VoteCast, VoteResponse, VoteStatus, VoteConfirmResponse, DoubleVoteResponse
from app.services.blockchain import get_blockchain_service

router = APIRouter(prefix="/api/votes", tags=["votes"])


@router.post("", response_model=VoteConfirmResponse, status_code=status.HTTP_201_CREATED)
def cast_vote(
    data: VoteCast,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
):
    """
    Cast a vote with double-vote protection and eligibility enforcement.
    The backend enforces that each voter can only vote once per election.
    """
    # 1. Find voter by voter_id string
    voter = db.query(Voter).filter(Voter.voter_id == data.voter_id).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found")

    # 2. Caller identity check: If authenticated as a voter, cannot vote as another voter
    if current_user and current_user.role == UserRole.VOTER and current_user.voter_id:
        if voter.id != current_user.voter_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Authenticated user cannot cast a ballot for a different voter identity",
            )

    # 3. Check voter eligibility status
    if voter.status in (VoterStatus.SUSPENDED, VoterStatus.INELIGIBLE):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Voter is not eligible to vote (status: {voter.status.value})",
        )

    # 4. Check election registration
    if voter.election_id != data.election_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Voter is not registered for this election",
        )

    # 5. Check double-vote per election
    existing_vote = (
        db.query(Vote)
        .filter(Vote.voter_id == voter.id, Vote.election_id == data.election_id)
        .first()
    )
    if existing_vote:
        raise HTTPException(
            status_code=409,
            detail={
                "success": False,
                "message": "This voting credential has already been used for this election. Your second ballot was not accepted.",
                "existing_ballot_reference": existing_vote.ballot_reference,
            },
        )

    # 3. Validate candidate exists in this election
    candidate = db.query(Candidate).filter(
        Candidate.id == data.candidate_id,
        Candidate.election_id == data.election_id,
    ).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found in this election")

    # 4. Validate election is live
    election = db.query(Election).filter(Election.id == data.election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    if election.status != ElectionStatus.LIVE:
        raise HTTPException(status_code=400, detail="Election is not currently accepting votes")

    # 5. Record on blockchain
    blockchain = get_blockchain_service()
    ballot_commitment = hashlib.sha256(
        f"{voter.voter_id}:{data.candidate_id}:{data.election_id}:{uuid.uuid4()}".encode()
    ).hexdigest()

    tx_result = blockchain.record_event(
        event_type="vote_cast",
        data={
            "election_id": data.election_id,
            "ballot_commitment": ballot_commitment,
        },
        actor=f"voter:{voter.voter_id}",
        election_id=data.election_id,
    )

    # 6. Create vote record
    vote = Vote(
        election_id=data.election_id,
        voter_id=voter.id,
        candidate_id=data.candidate_id,
        ballot_commitment=ballot_commitment,
        transaction_hash=tx_result["transaction_hash"],
        block_number=tx_result["block_number"],
    )
    db.add(vote)

    # 7. Update voter status
    voter.has_voted = True
    voter.voted_at = datetime.utcnow()

    # 8. Update election tallies
    election.votes_cast += 1
    candidate.votes_received += 1
    if election.votes_cast > 0 and election.total_voters > 0:
        candidate.vote_percentage = round(
            (candidate.votes_received / election.votes_cast) * 100, 1
        )

    # 9. Create audit record
    audit = AuditRecord(
        block_number=tx_result["block_number"],
        transaction_hash=tx_result["transaction_hash"],
        event_type=AuditEventType.VOTE_CAST,
        actor=f"Voter {voter.voter_id}",
        election_id=data.election_id,
        new_state=f"Ballot recorded for election #{data.election_id}",
        details=f"Ballot commitment: {ballot_commitment[:16]}...",
        smart_contract="VotingContract",
        status="verified",
    )
    db.add(audit)

    db.commit()

    return VoteConfirmResponse(
        success=True,
        message="Vote successfully recorded",
        ballot_reference=vote.ballot_reference,
        ballot_commitment=ballot_commitment,
        transaction_hash=tx_result["transaction_hash"],
    )


@router.get("/status", response_model=VoteStatus)
def get_vote_status(
    voter_id: str,
    election_id: int,
    db: Session = Depends(get_db),
):
    """Check if a voter has already voted in an election."""
    voter = db.query(Voter).filter(Voter.voter_id == voter_id).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found")

    vote = (
        db.query(Vote)
        .filter(Vote.voter_id == voter.id, Vote.election_id == election_id)
        .first()
    )

    return VoteStatus(
        voter_id=voter_id,
        election_id=election_id,
        has_voted=vote is not None,
        voted_at=vote.created_at if vote else None,
        ballot_reference=vote.ballot_reference if vote else None,
    )


@router.get("", response_model=list[VoteResponse])
def list_votes(
    election_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    """List votes (does not expose voter identity for privacy)."""
    query = db.query(Vote)
    if election_id:
        query = query.filter(Vote.election_id == election_id)
    votes = query.order_by(Vote.created_at.desc()).offset(skip).limit(limit).all()
    return votes
