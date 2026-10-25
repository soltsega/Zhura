"""Proposals API — governance proposals with validator voting and quorum."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import require_role
from app.models.user import User, UserRole
from app.models.proposal import Proposal, ProposalVote, ProposalStatus, ValidatorVote
from app.models.validator import Validator
from app.schemas.proposal import (
    ProposalCreate, ProposalVoteRequest, ProposalResponse,
    ProposalListResponse, ProposalVoteResponse,
)
from app.services.blockchain import get_blockchain_service
from app.models.audit import AuditRecord, AuditEventType

router = APIRouter(prefix="/api/proposals", tags=["proposals"])


@router.get("", response_model=ProposalListResponse)
def list_proposals(
    election_id: int = None,
    status_filter: str = None,
    db: Session = Depends(get_db),
):
    """List governance proposals."""
    query = db.query(Proposal)
    if election_id:
        query = query.filter(Proposal.election_id == election_id)
    if status_filter:
        query = query.filter(Proposal.status == status_filter)
    total = query.count()
    proposals = query.order_by(Proposal.created_at.desc()).all()
    return ProposalListResponse(proposals=proposals, total=total)


@router.get("/{proposal_id}", response_model=ProposalResponse)
def get_proposal(proposal_id: int, db: Session = Depends(get_db)):
    """Get a specific proposal with validator votes."""
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")
    return proposal


@router.post("", response_model=ProposalResponse, status_code=status.HTTP_201_CREATED)
def create_proposal(
    data: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin", "validator")),
):
    """Create a new governance proposal (restricted to admin and validator)."""
    # Auto-generate proposal number
    count = db.query(Proposal).count()
    proposal_number = f"#{count + 1:04d}"

    proposed_by = data.proposed_by or current_user.full_name or current_user.email
    proposal_dict = data.model_dump()
    proposal_dict["proposed_by"] = proposed_by

    proposal = Proposal(
        **proposal_dict,
        proposal_number=proposal_number,
        status=ProposalStatus.PENDING,
    )

    # Record on blockchain
    blockchain = get_blockchain_service()
    tx_result = blockchain.record_event(
        event_type="proposal_created",
        data={"title": data.title, "type": data.proposal_type},
        actor=proposed_by,
        election_id=data.election_id,
    )
    proposal.transaction_hash = tx_result["transaction_hash"]
    proposal.block_number = tx_result["block_number"]

    db.add(proposal)
    db.commit()
    db.refresh(proposal)
    return proposal


@router.post("/{proposal_id}/vote", response_model=ProposalResponse)
def vote_on_proposal(
    proposal_id: int,
    data: ProposalVoteRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("validator", "admin")),
):
    """Validator votes on a proposal. Checks quorum and updates status."""
    proposal = db.query(Proposal).filter(Proposal.id == proposal_id).first()
    if not proposal:
        raise HTTPException(status_code=404, detail="Proposal not found")

    if proposal.status != ProposalStatus.PENDING:
        raise HTTPException(status_code=400, detail="Proposal is not pending")

    # Determine validator ID:
    # If the caller is a validator user with an assigned validator_id, enforce that ID
    target_validator_id = data.validator_id
    if current_user.role == UserRole.VALIDATOR and current_user.validator_id:
        if data.validator_id and data.validator_id != current_user.validator_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Validator caller cannot submit votes for another validator node (assigned: {current_user.validator_id}, requested: {data.validator_id})",
            )
        target_validator_id = current_user.validator_id

    # Validate validator exists
    validator = db.query(Validator).filter(Validator.id == target_validator_id).first()
    if not validator:
        raise HTTPException(status_code=404, detail="Validator not found")

    # Check if already voted
    existing_vote = (
        db.query(ProposalVote)
        .filter(
            ProposalVote.proposal_id == proposal_id,
            ProposalVote.validator_id == target_validator_id,
        )
        .first()
    )
    if existing_vote:
        raise HTTPException(status_code=400, detail="Validator has already voted on this proposal")

    # Record the vote
    pvote = ProposalVote(
        proposal_id=proposal_id,
        validator_id=target_validator_id,
        vote=ValidatorVote(data.vote),
        comment=data.comment,
    )
    db.add(pvote)
    db.flush()

    # Update counters on proposal
    if data.vote == "approve":
        proposal.approve_count += 1
    elif data.vote == "reject":
        proposal.reject_count += 1

    approve_count = proposal.approve_count
    reject_count = proposal.reject_count

    # Record on blockchain
    blockchain = get_blockchain_service()
    tx_result = blockchain.record_event(
        event_type="proposal_vote",
        data={
            "proposal_id": proposal_id,
            "validator": validator.name,
            "vote": data.vote,
            "approve_count": approve_count,
            "reject_count": reject_count,
        },
        actor=validator.name,
        election_id=proposal.election_id,
    )

    # Check if quorum reached
    if approve_count >= proposal.required_quorum:
        proposal.status = ProposalStatus.APPROVED
        proposal.resolved_at = datetime.utcnow()

        blockchain.record_event(
            event_type="proposal_approved",
            data={"proposal_id": proposal_id, "approvals": approve_count},
            actor="GovernanceContract",
            election_id=proposal.election_id,
        )

        audit = AuditRecord(
            block_number=tx_result["block_number"],
            transaction_hash=tx_result["transaction_hash"],
            event_type=AuditEventType.PROPOSAL_APPROVED,
            actor="GovernanceContract",
            election_id=proposal.election_id,
            new_state=f"Proposal {proposal.proposal_number} approved — quorum reached ({approve_count}/{proposal.required_quorum})",
            validator_approvals=f"{approve_count}/{proposal.total_validators}",
            smart_contract="GovernanceContract",
            status="verified",
        )
        db.add(audit)

    elif reject_count > proposal.total_validators - proposal.required_quorum:
        proposal.status = ProposalStatus.REJECTED
        proposal.resolved_at = datetime.utcnow()

        audit = AuditRecord(
            block_number=tx_result["block_number"],
            transaction_hash=tx_result["transaction_hash"],
            event_type=AuditEventType.PROPOSAL_REJECTED,
            actor="GovernanceContract",
            election_id=proposal.election_id,
            new_state=f"Proposal {proposal.proposal_number} rejected",
            validator_approvals=f"{approve_count}/{proposal.total_validators}",
            smart_contract="GovernanceContract",
            status="verified",
        )
        db.add(audit)

    db.commit()
    db.refresh(proposal)
    return proposal
