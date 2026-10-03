"""Election model — core entity for the platform."""

import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, Enum, ForeignKey, Float, Boolean
)
from sqlalchemy.orm import relationship
from app.database import Base


class ElectionStatus(str, enum.Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    SUSPENDED = "suspended"


class ElectionType(str, enum.Enum):
    NATIONAL = "national"
    LOCAL = "local"
    BANK_BOARD = "bank_board"
    CORPORATE = "corporate"
    UNIVERSITY = "university"
    COOPERATIVE = "cooperative"
    ASSOCIATION = "association"
    NGO = "ngo"
    REFERENDUM = "referendum"


class VotingMethod(str, enum.Enum):
    FIRST_PAST_POST = "first_past_post"
    RANKED_CHOICE = "ranked_choice"
    APPROVAL = "approval"


class Election(Base):
    __tablename__ = "elections"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    election_type = Column(Enum(ElectionType), nullable=False)
    description = Column(Text, default="")
    status = Column(Enum(ElectionStatus), default=ElectionStatus.DRAFT)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    number_of_seats = Column(Integer, default=1)
    voting_method = Column(Enum(VotingMethod), default=VotingMethod.FIRST_PAST_POST)
    eligibility_rules = Column(Text, default="")
    total_voters = Column(Integer, default=0)
    votes_cast = Column(Integer, default=0)
    is_finalized = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    candidates = relationship("Candidate", back_populates="election", cascade="all, delete-orphan")
    voters = relationship("Voter", back_populates="election", cascade="all, delete-orphan")
    votes = relationship("Vote", back_populates="election", cascade="all, delete-orphan")
    proposals = relationship("Proposal", back_populates="election", cascade="all, delete-orphan")
    expenses = relationship("Expense", back_populates="election", cascade="all, delete-orphan")

    @property
    def turnout_percentage(self) -> float:
        if self.total_voters == 0:
            return 0.0
        return round((self.votes_cast / self.total_voters) * 100, 1)
