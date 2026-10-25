import os
import secrets
from pydantic_settings import BaseSettings


def get_default_secret_key() -> str:
    key = os.getenv("SECRET_KEY")
    if key:
        return key
    # In production or deployed environments without SECRET_KEY, generate an ephemeral cryptographically secure key
    if os.getenv("ENVIRONMENT") == "production" or os.getenv("RAILWAY_ENVIRONMENT") or os.getenv("RENDER"):
        return secrets.token_urlsafe(32)
    return "zhuranet-dev-insecure-secret-key-change-in-production"


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./zhura.db" if os.path.exists("zhura.db") else "sqlite:///./zhuranet.db")
    SECRET_KEY: str = get_default_secret_key()
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours
    BLOCKCHAIN_RPC_URL: str = os.getenv("BLOCKCHAIN_RPC_URL", "http://127.0.0.1:8545")
    USE_MOCK_BLOCKCHAIN: bool = True
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


settings = Settings()
