"""Candidate model — participants in elections."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.orm import relationship
from app.database import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    name = Column(String(255), nullable=False)
    position = Column(String(255), default="")
    organization = Column(String(255), default="")
    biography = Column(Text, default="")
    qualifications = Column(Text, default="")
    photo_url = Column(String(500), default="")
    is_active = Column(Boolean, default=True)
    votes_received = Column(Integer, default=0)
    vote_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    election = relationship("Election", back_populates="candidates")
    votes = relationship("Vote", back_populates="candidate")
