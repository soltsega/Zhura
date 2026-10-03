"""Pydantic schemas for Voter endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class VoterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    email: str = ""
    phone: str = ""
    region: str = ""
    polling_center: str = ""


class VoterCreate(VoterBase):
    election_id: int
    voter_id: str = Field(..., min_length=1, max_length=50)


class VoterUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    region: Optional[str] = None
    polling_center: Optional[str] = None
    status: Optional[str] = None


class VoterResponse(VoterBase):
    id: int
    voter_id: str
    election_id: int
    status: str
    has_voted: bool
    registered_at: datetime
    voted_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class VoterListResponse(BaseModel):
    voters: list[VoterResponse]
    total: int
    voted_count: int
    not_voted_count: int
