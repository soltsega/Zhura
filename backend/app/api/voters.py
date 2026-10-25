"""Voters API — CRUD operations for voter management."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.voter import Voter, VoterStatus
from app.schemas.voter import VoterCreate, VoterUpdate, VoterResponse, VoterListResponse
from app.api.deps import require_role
from app.models.user import User

router = APIRouter(prefix="/api/voters", tags=["voters"])


@router.get("", response_model=VoterListResponse)
def list_voters(
    election_id: int = None,
    has_voted: bool = None,
    search: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """List voters with optional filters."""
    query = db.query(Voter)
    if election_id:
        query = query.filter(Voter.election_id == election_id)
    if has_voted is not None:
        query = query.filter(Voter.has_voted == has_voted)
    if search:
        query = query.filter(
            Voter.name.ilike(f"%{search}%") |
            Voter.voter_id.ilike(f"%{search}%") |
            Voter.email.ilike(f"%{search}%")
        )
    total = query.count()
    voted_count = db.query(Voter).filter(Voter.has_voted == True).count()
    voters = query.offset(skip).limit(limit).all()
    return VoterListResponse(
        voters=voters,
        total=total,
        voted_count=voted_count,
        not_voted_count=total - voted_count,
    )


@router.get("/{voter_id}", response_model=VoterResponse)
def get_voter(
    voter_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Get a specific voter."""
    voter = db.query(Voter).filter(Voter.id == voter_id).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found")
    return voter


@router.post("", response_model=VoterResponse, status_code=status.HTTP_201_CREATED)
def create_voter(
    data: VoterCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Register a new voter."""
    existing = db.query(Voter).filter(Voter.voter_id == data.voter_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Voter ID already exists")
    voter = Voter(**data.model_dump())
    voter.status = VoterStatus.ELIGIBLE
    db.add(voter)
    db.commit()
    db.refresh(voter)
    return voter


@router.put("/{voter_id}", response_model=VoterResponse)
def update_voter(
    voter_id: int,
    data: VoterUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role("admin")),
):
    """Update a voter."""
    voter = db.query(Voter).filter(Voter.id == voter_id).first()
    if not voter:
        raise HTTPException(status_code=404, detail="Voter not found")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(voter, field, value)
    db.commit()
    db.refresh(voter)
    return voter
