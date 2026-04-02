from app.config import Settings, settings


def test_settings_has_required_fields():
    assert isinstance(settings, Settings)
    assert settings.DATABASE_URL == "sqlite:///./patient_portal.db"
    assert isinstance(settings.SECRET_KEY, str)
    assert len(settings.SECRET_KEY) > 0
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 30
