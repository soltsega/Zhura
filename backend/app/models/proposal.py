"""Proposal & ProposalVote models — governance system."""

import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Enum, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base


class ProposalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EXECUTED = "executed"
    EXPIRED = "expired"


class ProposalType(str, enum.Enum):
    EXTEND_VOTING_PERIOD = "extend_voting_period"
    SUSPEND_POLLING_CENTER = "suspend_polling_center"
    ADD_POLLING_CENTER = "add_polling_center"
    CHANGE_ELECTION_CONFIG = "change_election_config"
    EMERGENCY_PROCEDURE = "emergency_procedure"
    UPDATE_PROTOCOL = "update_protocol"
    OTHER = "other"


class ValidatorVote(str, enum.Enum):
    APPROVE = "approve"
    REJECT = "reject"
    ABSTAIN = "abstain"


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    proposal_number = Column(String(20), unique=True, nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, default="")
    proposal_type = Column(Enum(ProposalType), default=ProposalType.OTHER)
    proposed_by = Column(String(255), default="Election Administrator")
    status = Column(Enum(ProposalStatus), default=ProposalStatus.PENDING)
    required_quorum = Column(Integer, default=4)
    total_validators = Column(Integer, default=5)
    approve_count = Column(Integer, default=0)
    reject_count = Column(Integer, default=0)
    previous_value = Column(String(255), default="")
    proposed_value = Column(String(255), default="")
    reason = Column(Text, default="")
    transaction_hash = Column(String(256), default="")
    block_number = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    election = relationship("Election", back_populates="proposals")
    validator_votes = relationship("ProposalVote", back_populates="proposal", cascade="all, delete-orphan")


class ProposalVote(Base):
    __tablename__ = "proposal_votes"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    validator_id = Column(Integer, ForeignKey("validators.id"), nullable=False)
    vote = Column(Enum(ValidatorVote), nullable=False)
    comment = Column(Text, default="")
    voted_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    proposal = relationship("Proposal", back_populates="validator_votes")
    validator = relationship("Validator")
