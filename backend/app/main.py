"""Zhuranet — Governance-as-a-Service Backend

Main FastAPI application entry point.
Run with: uvicorn app.main:app --reload --port 8000
"""

import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

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
    allow_origin_regex=r"https?://.*(\.onrender\.com|\.railway\.app)",
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


# Static files & Single-Page Application (SPA) serving
STATIC_DIR = os.getenv("STATIC_DIR", os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static")))
if not os.path.isdir(STATIC_DIR):
    alt_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
    if os.path.isdir(alt_dir):
        STATIC_DIR = alt_dir

if os.path.isdir(STATIC_DIR):
    assets_dir = os.path.join(STATIC_DIR, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Don't intercept API routes or documentation
        if full_path.startswith("api/") or full_path in ("docs", "redoc", "openapi.json"):
            raise HTTPException(status_code=404, detail="Not Found")

        file_path = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)

        index_file = os.path.join(STATIC_DIR, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")
else:
    @app.get("/")
    def root():
        return {
            "name": "Zhuranet",
            "tagline": "Trust in Every Vote.",
            "docs": "/api/docs",
        }
