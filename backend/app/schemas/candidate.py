"""Pydantic schemas for Candidate endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class CandidateBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    position: str = ""
    organization: str = ""
    biography: str = ""
    qualifications: str = ""
    photo_url: str = ""


class CandidateCreate(CandidateBase):
    election_id: int


class CandidateUpdate(BaseModel):
    name: Optional[str] = None
    position: Optional[str] = None
    organization: Optional[str] = None
    biography: Optional[str] = None
    qualifications: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: Optional[bool] = None


class CandidateResponse(CandidateBase):
    id: int
    election_id: int
    is_active: bool
    votes_received: int
    vote_percentage: float
    created_at: datetime

    model_config = {"from_attributes": True}


class CandidateListResponse(BaseModel):
    candidates: list[CandidateResponse]
    total: int
