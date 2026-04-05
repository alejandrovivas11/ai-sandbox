"""
Application configuration using pydantic-settings.

Reads from environment variables and .env file.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    DATABASE_URL: str = "sqlite:///./clinic.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]
    ALGORITHM: str = "HS256"

    model_config = {"env_file": ".env"}


settings = Settings()
