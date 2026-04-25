import pytest
from fastapi import HTTPException


class TestCredentialsException:
    """Tests for CredentialsException."""

    def test_credentials_exception_is_http_exception(self):
        """CredentialsException must be an instance of HTTPException."""
        from src.shared.exceptions import CredentialsException
        assert isinstance(CredentialsException, HTTPException)

    def test_credentials_exception_status_code_is_401(self):
        """CredentialsException must have status_code 401."""
        from src.shared.exceptions import CredentialsException
        assert CredentialsException.status_code == 401

    def test_credentials_exception_has_www_authenticate_bearer_header(self):
        """CredentialsException must include WWW-Authenticate: Bearer header."""
        from src.shared.exceptions import CredentialsException
        assert CredentialsException.headers is not None
        assert CredentialsException.headers.get("WWW-Authenticate") == "Bearer"


class TestUserAlreadyExistsException:
    """Tests for UserAlreadyExistsException."""

    def test_user_already_exists_exception_is_http_exception(self):
        """UserAlreadyExistsException must be an instance of HTTPException."""
        from src.shared.exceptions import UserAlreadyExistsException
        assert isinstance(UserAlreadyExistsException, HTTPException)

    def test_user_already_exists_exception_status_code_is_409(self):
        """UserAlreadyExistsException must have status_code 409."""
        from src.shared.exceptions import UserAlreadyExistsException
        assert UserAlreadyExistsException.status_code == 409
