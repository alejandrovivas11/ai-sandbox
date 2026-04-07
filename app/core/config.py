import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    app_title: str = "AI Sandbox"
    app_version: str = "0.1.0"
    debug: bool = False
    database_url: str = os.environ.get(
        "DATABASE_URL",
        "sqlite:///./staff.db",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
