"""User model — authentication for admin/validator/voter roles."""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Enum, Boolean
from app.database import Base


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    VALIDATOR = "validator"
    VOTER = "voter"
    PUBLIC = "public"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), default="")
    role = Column(Enum(UserRole), default=UserRole.VOTER)
    is_active = Column(Boolean, default=True)
    validator_id = Column(Integer, nullable=True)  # Link to validator org if role=validator
    voter_id = Column(Integer, nullable=True)  # Link to voter if role=voter
    created_at = Column(DateTime, default=datetime.utcnow)
