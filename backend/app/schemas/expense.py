"""Pydantic schemas for Expense endpoints."""

from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional


class ExpenseBase(BaseModel):
    category: str
    amount: float = Field(..., gt=0)
    description: str = ""
    authorized_by: str = "Election Administrator"


class ExpenseCreate(ExpenseBase):
    election_id: int


class ExpenseResponse(ExpenseBase):
    id: int
    expense_id: str
    election_id: int
    document_hash: str
    status: str
    created_at: datetime

    model_config = {"from_attributes": True}


class ExpenseListResponse(BaseModel):
    expenses: list[ExpenseResponse]
    total: int
    total_amount: float


class ExpenseSummary(BaseModel):
    category: str
    total_amount: float
    count: int
