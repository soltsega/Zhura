"""Vote model — individual ballot records."""

import uuid
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base


class Vote(Base):
    __tablename__ = "votes"

    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    voter_id = Column(Integer, ForeignKey("voters.id"), nullable=False)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    ballot_reference = Column(String(50), unique=True, nullable=False, default=lambda: f"VR-{uuid.uuid4().hex[:8].upper()}")
    ballot_commitment = Column(String(256), default="")  # Hash of the vote for blockchain
    transaction_hash = Column(String(256), default="")
    block_number = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    election = relationship("Election", back_populates="votes")
    voter = relationship("Voter", back_populates="votes")
    candidate = relationship("Candidate", back_populates="votes")
