"""Auth API — login and user info."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, TokenResponse, UserResponse
from app.services.auth import authenticate_user, create_access_token
from app.api.deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token."""
    user = authenticate_user(db, request.email, request.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email, "role": user.role.value}
    )
    return TokenResponse(
        access_token=access_token,
        role=user.role.value,
        user_id=user.id,
        email=user.email,
        full_name=user.full_name,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current authenticated user."""
    return current_user


@router.get("/demo-accounts")
def get_demo_accounts():
    """List available demo accounts (no auth required)."""
    return {
        "accounts": [
            {
                "email": "admin@zhura.demo",
                "password": "demo123",
                "role": "admin",
                "name": "Election Administrator",
                "description": "Full access to election management and administration",
            },
            {
                "email": "validator@zhura.demo",
                "password": "demo123",
                "role": "validator",
                "name": "Addis Transparency Organization",
                "description": "Independent validator — review and approve governance proposals",
            },
            {
                "email": "voter@zhura.demo",
                "password": "demo123",
                "role": "voter",
                "name": "Demo Voter",
                "description": "Cast votes in the active election",
            },
        ]
    }
