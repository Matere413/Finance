import pytest
from unittest.mock import patch
from pydantic import ValidationError


class TestSettings:
    """Tests for the Settings class loaded from pydantic-settings."""

    def test_settings_loads_secret_key_from_env(self):
        """Settings reads SECRET_KEY from the environment."""
        # override_settings fixture already sets SECRET_KEY in os.environ,
        # but we import Settings fresh to avoid module-level singleton.
        with patch.dict("os.environ", {"SECRET_KEY": "my-super-secret"}, clear=False):
            # Re-import inside the patch so pydantic-settings picks up the env var
            import importlib
            import src.shared.config as config_module
            importlib.reload(config_module)
            fresh_settings = config_module.Settings()
            assert fresh_settings.SECRET_KEY == "my-super-secret"

    def test_settings_database_url_default(self):
        """DATABASE_URL defaults to sqlite+aiosqlite:///./finance.db."""
        from src.shared.config import Settings
        s = Settings()
        assert s.DATABASE_URL == "sqlite+aiosqlite:///./finance.db"

    def test_settings_access_token_expire_minutes_default(self):
        """ACCESS_TOKEN_EXPIRE_MINUTES defaults to 15."""
        from src.shared.config import Settings
        s = Settings()
        assert s.ACCESS_TOKEN_EXPIRE_MINUTES == 15

    def test_settings_refresh_token_expire_minutes_default(self):
        """REFRESH_TOKEN_EXPIRE_MINUTES defaults to 1440 (1 day in minutes)."""
        from src.shared.config import Settings
        s = Settings()
        assert s.REFRESH_TOKEN_EXPIRE_MINUTES == 1440

    def test_settings_refresh_token_expire_days_removed(self):
        """REFRESH_TOKEN_EXPIRE_DAYS must no longer exist on Settings."""
        from src.shared.config import Settings
        s = Settings()
        assert not hasattr(s, "REFRESH_TOKEN_EXPIRE_DAYS"), (
            "REFRESH_TOKEN_EXPIRE_DAYS was renamed to REFRESH_TOKEN_EXPIRE_MINUTES"
        )

    def test_settings_environment_default(self):
        """ENVIRONMENT defaults to 'dev'."""
        from src.shared.config import Settings
        s = Settings()
        assert s.ENVIRONMENT == "dev"

    def test_settings_raises_validation_error_when_secret_key_missing(self):
        """Settings raises ValidationError when SECRET_KEY is not set."""
        with patch.dict("os.environ", {}, clear=True):
            from src.shared.config import Settings
            with pytest.raises(ValidationError):
                Settings(_env_file=None)
