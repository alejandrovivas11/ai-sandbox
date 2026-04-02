from app.config import Settings, settings


def test_settings_has_required_fields():
    assert isinstance(settings, Settings)
    assert settings.DATABASE_URL == "sqlite:///./patient_portal.db"
    assert settings.SECRET_KEY == "dev-secret-key-change-in-production"
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
