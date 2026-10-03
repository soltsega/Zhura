"""Voter model — registered participants in elections."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from app.database import Base
import enum


class VoterStatus(str, enum.Enum):
    REGISTERED = "registered"
    ELIGIBLE = "eligible"
    INELIGIBLE = "ineligible"
    SUSPENDED = "suspended"


class Voter(Base):
    __tablename__ = "voters"

    id = Column(Integer, primary_key=True, index=True)
    voter_id = Column(String(50), unique=True, nullable=False, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    name = Column(String(255), nullable=False)
    email = Column(String(255), default="")
    phone = Column(String(50), default="")
    region = Column(String(255), default="")
    polling_center = Column(String(255), default="")
    status = Column(Enum(VoterStatus), default=VoterStatus.REGISTERED)
    has_voted = Column(Boolean, default=False)
    credential_hash = Column(String(256), default="")
    registered_at = Column(DateTime, default=datetime.utcnow)
    voted_at = Column(DateTime, nullable=True)

    # Relationships
    election = relationship("Election", back_populates="voters")
    votes = relationship("Vote", back_populates="voter")
