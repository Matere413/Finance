import uuid
from datetime import datetime

import pytest
from pydantic import ValidationError


class TestRegisterRequest:
    """Tests for RegisterRequest schema."""

    def test_valid_email_and_password_creates_model(self):
        """Valid email and password (>=8 chars) should produce a valid model."""
        from src.features.auth.schemas import RegisterRequest
        req = RegisterRequest(email="user@example.com", password="securepass")
        assert req.email == "user@example.com"
        assert req.password == "securepass"

    def test_email_is_coerced_to_lowercase(self):
        """Email must be coerced to lowercase before validation."""
        from src.features.auth.schemas import RegisterRequest
        req = RegisterRequest(email="User@Example.COM", password="securepass")
        assert req.email == "user@example.com"

    def test_invalid_email_format_raises_validation_error(self):
        """Non-email string must raise ValidationError."""
        from src.features.auth.schemas import RegisterRequest
        with pytest.raises(ValidationError):
            RegisterRequest(email="not-an-email", password="securepass")

    def test_password_shorter_than_8_chars_raises_validation_error(self):
        """Password with fewer than 8 characters must raise ValidationError."""
        from src.features.auth.schemas import RegisterRequest
        with pytest.raises(ValidationError):
            RegisterRequest(email="user@example.com", password="short")

    def test_missing_email_raises_validation_error(self):
        """Omitting email must raise ValidationError."""
        from src.features.auth.schemas import RegisterRequest
        with pytest.raises(ValidationError):
            RegisterRequest(password="securepass")

    def test_missing_password_raises_validation_error(self):
        """Omitting password must raise ValidationError."""
        from src.features.auth.schemas import RegisterRequest
        with pytest.raises(ValidationError):
            RegisterRequest(email="user@example.com")


class TestLoginRequest:
    """Tests for LoginRequest schema."""

    def test_valid_email_and_password_creates_model(self):
        """Valid email and password should produce a valid model."""
        from src.features.auth.schemas import LoginRequest
        req = LoginRequest(email="user@example.com", password="anypassword")
        assert req.email == "user@example.com"
        assert req.password == "anypassword"

    def test_missing_email_raises_validation_error(self):
        """Omitting email must raise ValidationError."""
        from src.features.auth.schemas import LoginRequest
        with pytest.raises(ValidationError):
            LoginRequest(password="anypassword")

    def test_missing_password_raises_validation_error(self):
        """Omitting password must raise ValidationError."""
        from src.features.auth.schemas import LoginRequest
        with pytest.raises(ValidationError):
            LoginRequest(email="user@example.com")


class TestTokenResponse:
    """Tests for TokenResponse schema."""

    def test_has_access_token_and_token_type(self):
        """TokenResponse must expose access_token and token_type fields."""
        from src.features.auth.schemas import TokenResponse
        resp = TokenResponse(access_token="some.jwt.token", token_type="bearer")
        assert resp.access_token == "some.jwt.token"
        assert resp.token_type == "bearer"

    def test_token_type_defaults_to_bearer(self):
        """token_type must default to 'bearer' when omitted."""
        from src.features.auth.schemas import TokenResponse
        resp = TokenResponse(access_token="some.jwt.token")
        assert resp.token_type == "bearer"


class TestUserResponse:
    """Tests for UserResponse schema."""

    def test_has_required_fields(self):
        """UserResponse must expose id, email, role, and created_at."""
        from src.features.auth.schemas import UserResponse
        user_id = uuid.uuid4()
        now = datetime.utcnow()
        resp = UserResponse(
            id=user_id,
            email="user@example.com",
            role="user",
            created_at=now,
        )
        assert resp.id == user_id
        assert resp.email == "user@example.com"
        assert resp.role == "user"
        assert resp.created_at == now

    def test_does_not_expose_hashed_password(self):
        """UserResponse must not have a hashed_password field."""
        from src.features.auth.schemas import UserResponse
        assert not hasattr(UserResponse, "hashed_password")

    def test_from_attributes_is_true(self):
        """UserResponse model_config must have from_attributes=True."""
        from src.features.auth.schemas import UserResponse
        assert UserResponse.model_config.get("from_attributes") is True
