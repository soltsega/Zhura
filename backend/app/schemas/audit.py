"""Pydantic schemas for Audit endpoints."""

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class AuditRecordResponse(BaseModel):
    id: int
    block_number: int
    transaction_hash: str
    event_type: str
    actor: str
    election_id: Optional[int] = None
    previous_state: str
    new_state: str
    details: str
    validator_approvals: str
    smart_contract: str
    status: str
    timestamp: datetime

    model_config = {"from_attributes": True}


class AuditListResponse(BaseModel):
    records: list[AuditRecordResponse]
    total: int
    latest_block: int


class BlockchainStatus(BaseModel):
    chain_id: int
    block_number: int
    total_records: int
    network_status: str
    last_block_time: datetime
    validators_online: int
    total_validators: int
