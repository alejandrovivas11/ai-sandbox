import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./patient_portal.db"
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "INSECURE-DEFAULT-KEY-CHANGE-ME-IN-PRODUCTION")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = {"env_file": ".env"}


settings = Settings()
