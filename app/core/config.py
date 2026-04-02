import os


class Settings:
    """Application settings loaded from environment variables.

    SECRET_KEY has no default and must always be provided via the
    SECRET_KEY environment variable.  Failing to set it will raise
    a ValueError at startup so that the application never runs with
    an insecure or missing key.
    """

    def __init__(self) -> None:
        self.DATABASE_URL: str = os.environ.get(
            "DATABASE_URL", "sqlite:///./patient_portal.db"
        )

        secret_key = os.environ.get("SECRET_KEY")
        if not secret_key:
            raise ValueError(
                "SECRET_KEY environment variable is required. "
                "Set it to a secure random string before running the application."
            )
        self.SECRET_KEY: str = secret_key

        self.ALGORITHM: str = os.environ.get("ALGORITHM", "HS256")
        self.ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
            os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )


settings = Settings()
