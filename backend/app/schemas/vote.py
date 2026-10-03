"""Pydantic schemas for Vote endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class VoteCast(BaseModel):
    voter_id: str = Field(..., description="Voter ID (e.g. VTR-0001)")
    candidate_id: int = Field(..., description="Selected candidate ID")
    election_id: int = Field(..., description="Election ID")


class VoteResponse(BaseModel):
    id: int
    election_id: int
    candidate_id: int
    ballot_reference: str
    transaction_hash: str
    block_number: int
    created_at: datetime

    model_config = {"from_attributes": True}


class VoteStatus(BaseModel):
    voter_id: str
    election_id: int
    has_voted: bool
    voted_at: Optional[datetime] = None
    ballot_reference: Optional[str] = None


class DoubleVoteResponse(BaseModel):
    success: bool = False
    message: str
    existing_ballot_reference: Optional[str] = None


class VoteConfirmResponse(BaseModel):
    success: bool
    message: str
    ballot_reference: str
    ballot_commitment: str
    transaction_hash: str
