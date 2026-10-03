"""Pydantic schemas for Proposal endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ProposalBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = ""
    proposal_type: str = "other"
    proposed_by: str = "Election Administrator"
    previous_value: str = ""
    proposed_value: str = ""
    reason: str = ""


class ProposalCreate(ProposalBase):
    election_id: int
    required_quorum: int = 4
    total_validators: int = 5


class ProposalVoteRequest(BaseModel):
    validator_id: int
    vote: str = Field(..., pattern="^(approve|reject|abstain)$")
    comment: str = ""


class ProposalVoteResponse(BaseModel):
    id: int
    proposal_id: int
    validator_id: int
    vote: str
    comment: str
    voted_at: datetime

    model_config = {"from_attributes": True}


class ProposalResponse(BaseModel):
    id: int
    proposal_number: str
    election_id: int
    title: str
    description: str
    proposal_type: str
    proposed_by: str
    status: str
    required_quorum: int
    total_validators: int
    approve_count: int = 0
    reject_count: int = 0
    previous_value: str
    proposed_value: str
    reason: str
    transaction_hash: str
    block_number: int
    created_at: datetime
    resolved_at: Optional[datetime] = None
    validator_votes: list[ProposalVoteResponse] = []

    model_config = {"from_attributes": True}


class ProposalListResponse(BaseModel):
    proposals: list[ProposalResponse]
    total: int
