"""AuditRecord model — blockchain-backed audit trail."""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from app.database import Base


class AuditEventType(str, enum.Enum):
    ELECTION_CREATED = "election_created"
    ELECTION_OPENED = "election_opened"
    ELECTION_CLOSED = "election_closed"
    VOTE_CAST = "vote_cast"
    PROPOSAL_CREATED = "proposal_created"
    PROPOSAL_APPROVED = "proposal_approved"
    PROPOSAL_REJECTED = "proposal_rejected"
    PROPOSAL_EXECUTED = "proposal_executed"
    RULE_CHANGE_ATTEMPTED = "rule_change_attempted"
    RULE_CHANGE_BLOCKED = "rule_change_blocked"
    EXPENSE_RECORDED = "expense_recorded"
    CANDIDATE_REGISTERED = "candidate_registered"
    RESULT_FINALIZED = "result_finalized"
    GOVERNANCE_ATTACK = "governance_attack"


class AuditRecord(Base):
    __tablename__ = "audit_records"

    id = Column(Integer, primary_key=True, index=True)
    block_number = Column(Integer, nullable=False, index=True)
    transaction_hash = Column(String(256), nullable=False)
    event_type = Column(Enum(AuditEventType), nullable=False)
    actor = Column(String(255), default="")
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=True)
    previous_state = Column(Text, default="")
    new_state = Column(Text, default="")
    details = Column(Text, default="")
    validator_approvals = Column(String(255), default="")
    smart_contract = Column(String(255), default="")
    status = Column(String(50), default="verified")
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
