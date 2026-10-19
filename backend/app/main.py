"""Zhura — Governance-as-a-Service Backend

Main FastAPI application entry point.
Run with: uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import auth, elections, candidates, voters, votes, proposals, expenses, audit
from app.database import init_db

app = FastAPI(
    title="Zhura API",
    description="Governance-as-a-Service backend — secure, transparent, independently auditable elections.",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(elections.router)
app.include_router(candidates.router)
app.include_router(voters.router)
app.include_router(votes.router)
app.include_router(proposals.router)
app.include_router(expenses.router)
app.include_router(audit.router)


@app.on_event("startup")
def on_startup():
    """Initialize database tables on startup."""
    init_db()


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "zhura-api",
        "version": "0.1.0",
    }


@app.get("/")
def root():
    return {
        "name": "ዝሁራ (Zhura)",
        "tagline": "Trust in Every Vote.",
        "docs": "/api/docs",
    }
