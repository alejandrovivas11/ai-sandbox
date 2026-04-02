import secrets
import warnings

from pydantic import BaseSettings, Field, root_validator

_MIN_SECRET_KEY_LENGTH = 32


def _generate_secret_key() -> str:
    return secrets.token_urlsafe(64)


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/patient_mgmt"
    SECRET_KEY: str = Field(default_factory=_generate_secret_key)
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list = Field(
        default=[
            "http://localhost:3000",
            "http://localhost:8001",
        ]
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    @root_validator
    def validate_settings(cls, values: dict) -> dict:
        environment = values.get("ENVIRONMENT", "development")
        secret_key = values.get("SECRET_KEY", "")

        if environment == "production":
            if len(secret_key) < _MIN_SECRET_KEY_LENGTH:
                raise ValueError(
                    f"SECRET_KEY must be at least {_MIN_SECRET_KEY_LENGTH} characters "
                    "long in production to ensure sufficient entropy. "
                    "Generate a secure key with: "
                    'python -c "import secrets; print(secrets.token_urlsafe(64))"'
                )

        cors_origins = values.get("CORS_ORIGINS", [])
        if "*" in cors_origins:
            raise ValueError(
                "CORS_ORIGINS must not contain the '*' wildcard. "
                "Specify explicit allowed origins instead to prevent "
                "credentialed cross-origin attacks."
            )

        return values


settings = Settings()
