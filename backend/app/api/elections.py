"""Elections API — CRUD operations for elections."""

from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.election import Election, ElectionStatus
from app.schemas.election import ElectionCreate, ElectionUpdate, ElectionResponse, ElectionListResponse
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/elections", tags=["elections"])


@router.get("", response_model=ElectionListResponse)
def list_elections(
    skip: int = 0,
    limit: int = 50,
    status_filter: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List all elections."""
    query = db.query(Election)
    if status_filter:
        query = query.filter(Election.status == status_filter)
    total = query.count()
    elections = query.order_by(Election.created_at.desc()).offset(skip).limit(limit).all()
    return ElectionListResponse(elections=elections, total=total)


@router.get("/{election_id}", response_model=ElectionResponse)
def get_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Get a specific election."""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    return election


@router.post("", response_model=ElectionResponse, status_code=status.HTTP_201_CREATED)
def create_election(
    data: ElectionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a new election."""
    election = Election(**data.model_dump())
    db.add(election)
    db.commit()
    db.refresh(election)
    return election


@router.put("/{election_id}", response_model=ElectionResponse)
def update_election(
    election_id: int,
    data: ElectionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Update an election."""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(election, field, value)
    election.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(election)
    return election


@router.post("/{election_id}/activate", response_model=ElectionResponse)
def activate_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Activate (open) an election for voting."""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    if election.status not in (ElectionStatus.DRAFT, ElectionStatus.SCHEDULED):
        raise HTTPException(status_code=400, detail="Election cannot be activated from current status")
    election.status = ElectionStatus.LIVE
    election.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(election)
    return election


@router.post("/{election_id}/close", response_model=ElectionResponse)
def close_election(
    election_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Close an election."""
    election = db.query(Election).filter(Election.id == election_id).first()
    if not election:
        raise HTTPException(status_code=404, detail="Election not found")
    election.status = ElectionStatus.COMPLETED
    election.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(election)
    return election
