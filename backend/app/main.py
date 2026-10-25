"""Zhuranet — Governance-as-a-Service Backend

Main FastAPI application entry point.
Run with: uvicorn app.main:app --reload --port 8000
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api import auth, elections, candidates, voters, votes, proposals, expenses, audit
from app.database import init_db

app = FastAPI(
    title="Zhuranet API",
    description="Governance-as-a-Service backend — secure, transparent, independently auditable elections.",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if "*" not in settings.CORS_ORIGINS else ["*"],
    allow_origin_regex=r"https?://.*\.railway\.app",
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
    """Initialize database tables and seed if database is empty."""
    init_db()
    try:
        from app.database import SessionLocal
        from app.models.user import User
        from app.seed import seed_database
        db = SessionLocal()
        try:
            if db.query(User).count() == 0:
                seed_database()
        finally:
            db.close()
    except Exception as exc:
        print(f"Auto-seeding check skipped: {exc}")



@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "zhuranet-api",
        "version": "0.1.0",
    }


@app.get("/")
def root():
    return {
        "name": "Zhuranet",
        "tagline": "Trust in Every Vote.",
        "docs": "/api/docs",
    }
