"""Expense model — election expenditure tracking."""

import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Enum, Float
)
from sqlalchemy.orm import relationship
from app.database import Base


class ExpenseCategory(str, enum.Enum):
    POLLING_WORKERS = "polling_workers"
    OBSERVERS = "observers"
    LOGISTICS = "logistics"
    EQUIPMENT = "equipment"
    TRAINING = "training"
    ADMINISTRATION = "administration"
    TRANSPORTATION = "transportation"
    OTHER = "other"


class ExpenseStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    PAID = "paid"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    expense_id = Column(String(50), unique=True, nullable=False)
    election_id = Column(Integer, ForeignKey("elections.id"), nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(Text, default="")
    authorized_by = Column(String(255), default="Election Administrator")
    document_hash = Column(String(256), default="")  # Hash of supporting document
    status = Column(Enum(ExpenseStatus), default=ExpenseStatus.PENDING)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    election = relationship("Election", back_populates="expenses")
