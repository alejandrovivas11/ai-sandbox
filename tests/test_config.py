from app.config import settings


def test_settings_secret_key() -> None:
    """Verify that settings.SECRET_KEY equals the expected value."""
    assert settings.SECRET_KEY == "super-secret-key-change-in-production"


def test_settings_algorithm() -> None:
    """Verify that settings.ALGORITHM equals 'HS256'."""
    assert settings.ALGORITHM == "HS256"


def test_settings_token_expiry() -> None:
    """Verify that settings.ACCESS_TOKEN_EXPIRE_MINUTES equals 30."""
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
