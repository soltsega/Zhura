"""Expenses API — election expenditure tracking."""

import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.expense import Expense, ExpenseCategory, ExpenseStatus
from app.schemas.expense import ExpenseCreate, ExpenseResponse, ExpenseListResponse, ExpenseSummary
from app.services.blockchain import get_blockchain_service
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("", response_model=ExpenseListResponse)
def list_expenses(
    election_id: int = None,
    category: str = None,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """List election expenses."""
    query = db.query(Expense)
    if election_id:
        query = query.filter(Expense.election_id == election_id)
    if category:
        query = query.filter(Expense.category == category)
    total = query.count()
    total_amount = db.query(func.sum(Expense.amount)).scalar() or 0
    expenses = query.order_by(Expense.created_at.desc()).offset(skip).limit(limit).all()
    return ExpenseListResponse(expenses=expenses, total=total, total_amount=total_amount)


@router.get("/summary", response_model=list[ExpenseSummary])
def get_expense_summary(
    election_id: int = None,
    db: Session = Depends(get_db),
):
    """Get expense summary by category."""
    query = db.query(
        Expense.category,
        func.sum(Expense.amount).label("total_amount"),
        func.count(Expense.id).label("count"),
    )
    if election_id:
        query = query.filter(Expense.election_id == election_id)
    results = query.group_by(Expense.category).all()
    return [
        ExpenseSummary(category=r.category, total_amount=r.total_amount, count=r.count)
        for r in results
    ]


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Record a new election expense."""
    expense_count = db.query(Expense).count()
    expense = Expense(
        **data.model_dump(),
        expense_id=f"EXP-{expense_count + 1:05d}",
    )

    # Record on blockchain (document hash)
    blockchain = get_blockchain_service()
    tx_result = blockchain.record_event(
        event_type="expense_recorded",
        data={
            "expense_id": expense.expense_id,
            "category": data.category,
            "amount": data.amount,
        },
        actor=data.authorized_by,
        election_id=data.election_id,
    )

    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense
