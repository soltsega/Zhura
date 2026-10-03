"""Pydantic schemas for Election endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ElectionBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    election_type: str
    description: str = ""
    start_date: datetime
    end_date: datetime
    number_of_seats: int = 1
    voting_method: str = "first_past_post"
    eligibility_rules: str = ""


class ElectionCreate(ElectionBase):
    pass


class ElectionUpdate(BaseModel):
    name: Optional[str] = None
    election_type: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    number_of_seats: Optional[int] = None
    voting_method: Optional[str] = None
    eligibility_rules: Optional[str] = None
    status: Optional[str] = None


class ElectionResponse(ElectionBase):
    id: int
    status: str
    total_voters: int
    votes_cast: int
    is_finalized: bool
    turnout_percentage: float
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ElectionListResponse(BaseModel):
    elections: list[ElectionResponse]
    total: int
