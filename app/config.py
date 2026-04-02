import warnings

try:
    from pydantic_settings import BaseSettings
except ImportError as exc:
    raise ImportError(
        "pydantic-settings is required. Install it with: pip install pydantic-settings"
    ) from exc

from pydantic import model_validator

_DEFAULT_SECRET_KEY = "dev-secret-key"
_MIN_SECRET_KEY_LENGTH = 32


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/patient_mgmt"
    SECRET_KEY: str = _DEFAULT_SECRET_KEY
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://localhost:8001",
    ]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }

    @model_validator(mode="after")
    def validate_secret_key(self) -> "Settings":
        """Enforce that the SECRET_KEY is strong enough for production use."""
        if self.ENVIRONMENT == "production":
            if self.SECRET_KEY == _DEFAULT_SECRET_KEY:
                raise ValueError(
                    "SECRET_KEY must be changed from the default value in production. "
                    "Generate a secure key with: "
                    'python -c "import secrets; print(secrets.token_urlsafe(64))"'
                )
            if len(self.SECRET_KEY) < _MIN_SECRET_KEY_LENGTH:
                raise ValueError(
                    f"SECRET_KEY must be at least {_MIN_SECRET_KEY_LENGTH} characters "
                    "long in production to ensure sufficient entropy."
                )
        elif self.SECRET_KEY == _DEFAULT_SECRET_KEY:
            warnings.warn(
                "Using default SECRET_KEY. This is acceptable for local development "
                "but must be changed in production. Set the SECRET_KEY environment "
                "variable to a strong random value.",
                UserWarning,
                stacklevel=2,
            )
        return self


settings = Settings()
