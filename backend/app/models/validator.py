"""Validator model — independent organizations that validate governance."""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from app.database import Base


class Validator(Base):
    __tablename__ = "validators"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    abbreviation = Column(String(10), default="")
    description = Column(Text, default="")
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=True)
    contact_email = Column(String(255), default="")
    registered_at = Column(DateTime, default=datetime.utcnow)


