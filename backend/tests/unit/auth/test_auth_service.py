"""
T-019, T-021, T-023, T-025 — Failing unit tests for AuthService
Uses AsyncMock / MagicMock — NO real DB.
"""
import hashlib
import uuid
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock

import pytest
from fastapi import HTTPException


# ---------------------------------------------------------------------------
# Shared fixtures
# ---------------------------------------------------------------------------


@pytest.fixture
def mock_user_repo():
    repo = AsyncMock()
    repo.get_by_email = AsyncMock(return_value=None)
    repo.get_by_id = AsyncMock(return_value=None)
    repo.save = AsyncMock(side_effect=lambda u: u)
    return repo


@pytest.fixture
def mock_token_repo():
    repo = AsyncMock()
    repo.save = AsyncMock(side_effect=lambda t: t)
    repo.get_by_hash = AsyncMock(return_value=None)
    repo.revoke_all_for_user = AsyncMock(return_value=None)
    return repo


@pytest.fixture
def service(mock_user_repo, mock_token_repo):
    from src.features.auth.service import AuthService
    return AuthService(user_repo=mock_user_repo, token_repo=mock_token_repo)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_user(email: str = "user@test.com", is_active: bool = True, password_plain: str | None = None):
    """Build a User instance (lazy import to avoid collection-time settings failure)."""
    from src.features.auth.model import User
    from passlib.context import CryptContext

    hashed = "hashed"
    if password_plain is not None:
        ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
        hashed = ctx.hash(password_plain)

    return User(
        id=uuid.uuid4(),
        email=email,
        hashed_password=hashed,
        role="user",
        is_active=is_active,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc),
    )


def _make_access_token(user_id: uuid.UUID, expired: bool = False) -> str:
    """Create a JWT access token (optionally expired)."""
    from jose import jwt
    from src.shared.config import settings

    exp = (
        datetime.now(timezone.utc) - timedelta(hours=1)
        if expired
        else datetime.now(timezone.utc) + timedelta(minutes=15)
    )
    return jwt.encode({"sub": str(user_id), "exp": exp}, settings.SECRET_KEY, algorithm="HS256")


def _make_refresh_token_record(
    user_id: uuid.UUID,
    raw: str,
    revoked: bool = False,
    expired: bool = False,
):
    """Build a RefreshToken ORM-like object."""
    from src.features.auth.model import RefreshToken

    token_hash = hashlib.sha256(raw.encode()).hexdigest()
    expires_at = (
        datetime.now(timezone.utc) - timedelta(days=1)
        if expired
        else datetime.now(timezone.utc) + timedelta(days=7)
    )
    return RefreshToken(
        id=uuid.uuid4(),
        user_id=user_id,
        token_hash=token_hash,
        expires_at=expires_at,
        revoked=revoked,
    )


# ---------------------------------------------------------------------------
# T-019 — AuthService.register
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_register_returns_user_response(service, mock_user_repo):
    """A-1: valid email+password returns UserResponse with correct email."""
    from src.features.auth.schemas import UserResponse

    user = _make_user("user@test.com")
    mock_user_repo.save = AsyncMock(return_value=user)

    result = await service.register("user@test.com", "password123")

    assert isinstance(result, UserResponse)
    assert result.email == "user@test.com"


@pytest.mark.asyncio
async def test_register_hashes_password(service, mock_user_repo):
    """A-8: password must be stored hashed, never plaintext."""
    saved_users = []

    async def capture_save(u):
        saved_users.append(u)
        u.id = uuid.uuid4()
        u.created_at = datetime.now(timezone.utc)
        u.updated_at = datetime.now(timezone.utc)
        return u

    mock_user_repo.save = capture_save

    await service.register("user@test.com", "plainpassword")

    assert len(saved_users) == 1
    assert saved_users[0].hashed_password != "plainpassword"
    assert saved_users[0].hashed_password.startswith("$2b$")


@pytest.mark.asyncio
async def test_register_duplicate_email_raises_409(service, mock_user_repo):
    """A-2: duplicate email raises HTTPException 409."""
    mock_user_repo.get_by_email = AsyncMock(return_value=_make_user("existing@test.com"))

    with pytest.raises(HTTPException) as exc_info:
        await service.register("existing@test.com", "password123")

    assert exc_info.value.status_code == 409


@pytest.mark.asyncio
async def test_register_email_stored_lowercase(service, mock_user_repo):
    """A-3: email is normalized to lowercase before save."""
    saved_users = []

    async def capture_save(u):
        saved_users.append(u)
        u.id = uuid.uuid4()
        u.created_at = datetime.now(timezone.utc)
        u.updated_at = datetime.now(timezone.utc)
        return u

    mock_user_repo.save = capture_save

    await service.register("User@Test.COM", "password123")

    assert len(saved_users) == 1
    assert saved_users[0].email == "user@test.com"


# ---------------------------------------------------------------------------
# T-021 — AuthService.login
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_login_returns_tokens(service, mock_user_repo, mock_token_repo):
    """B-1: valid credentials return (access_token, raw_refresh_token)."""
    user = _make_user(password_plain="correct_password")
    mock_user_repo.get_by_email = AsyncMock(return_value=user)

    result = await service.login("user@test.com", "correct_password")

    assert isinstance(result, tuple) and len(result) == 2
    access_token, raw_refresh = result
    assert isinstance(access_token, str) and len(access_token) > 0
    assert isinstance(raw_refresh, str) and len(raw_refresh) > 0


@pytest.mark.asyncio
async def test_login_wrong_password_raises_401(service, mock_user_repo):
    """B-2: correct email but wrong password raises 401."""
    user = _make_user(password_plain="correct_password")
    mock_user_repo.get_by_email = AsyncMock(return_value=user)

    with pytest.raises(HTTPException) as exc_info:
        await service.login("user@test.com", "wrong_password")

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_login_nonexistent_email_raises_401(service, mock_user_repo):
    """B-3: unknown email raises 401 (no user enumeration)."""
    mock_user_repo.get_by_email = AsyncMock(return_value=None)

    with pytest.raises(HTTPException) as exc_info:
        await service.login("nobody@test.com", "any_password")

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_login_inactive_user_raises_403(service, mock_user_repo):
    """B-4: is_active=False raises 403."""
    user = _make_user(password_plain="correct_password", is_active=False)
    mock_user_repo.get_by_email = AsyncMock(return_value=user)

    with pytest.raises(HTTPException) as exc_info:
        await service.login("user@test.com", "correct_password")

    assert exc_info.value.status_code == 403


@pytest.mark.asyncio
async def test_login_saves_refresh_token_hash(service, mock_user_repo, mock_token_repo):
    """B-1 extra: token_repo.save called with token whose hash matches sha256(raw)."""
    user = _make_user(password_plain="correct_password")
    mock_user_repo.get_by_email = AsyncMock(return_value=user)

    saved_tokens = []

    async def capture_token_save(t):
        saved_tokens.append(t)
        return t

    mock_token_repo.save = capture_token_save

    _, raw_refresh = await service.login("user@test.com", "correct_password")

    assert len(saved_tokens) == 1
    expected_hash = hashlib.sha256(raw_refresh.encode()).hexdigest()
    assert saved_tokens[0].token_hash == expected_hash


# ---------------------------------------------------------------------------
# T-023 — AuthService.logout
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_logout_revokes_all_user_tokens(service, mock_token_repo):
    """C-1: valid access token causes revoke_all_for_user with correct user_id."""
    user_id = uuid.uuid4()
    token = _make_access_token(user_id)

    await service.logout(token)

    mock_token_repo.revoke_all_for_user.assert_called_once_with(user_id)


@pytest.mark.asyncio
async def test_logout_invalid_token_raises_401(service):
    """C-3: malformed token string raises 401."""
    with pytest.raises(HTTPException) as exc_info:
        await service.logout("this.is.not.a.valid.jwt")

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_logout_expired_token_raises_401(service):
    """C-4: expired JWT raises 401."""
    expired_token = _make_access_token(uuid.uuid4(), expired=True)

    with pytest.raises(HTTPException) as exc_info:
        await service.logout(expired_token)

    assert exc_info.value.status_code == 401


# ---------------------------------------------------------------------------
# T-025 — AuthService.refresh
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_refresh_returns_new_access_token_and_raw_token(
    service, mock_user_repo, mock_token_repo
):
    """D-1: valid refresh token returns (new_access_token, new_raw_refresh)."""
    user_id = uuid.uuid4()
    raw_refresh = "valid_raw_token_abc123"
    stored_token = _make_refresh_token_record(user_id, raw_refresh)
    user = _make_user()
    user.id = user_id

    mock_token_repo.get_by_hash = AsyncMock(return_value=stored_token)
    mock_user_repo.get_by_id = AsyncMock(return_value=user)

    result = await service.refresh(raw_refresh)

    assert isinstance(result, tuple) and len(result) == 2
    new_access, new_raw = result
    assert isinstance(new_access, str) and len(new_access) > 0
    assert isinstance(new_raw, str) and new_raw != raw_refresh


@pytest.mark.asyncio
async def test_refresh_revoked_token_raises_401(service, mock_token_repo):
    """D-4: token with revoked=True raises 401."""
    raw_refresh = "revoked_raw_token"
    stored_token = _make_refresh_token_record(uuid.uuid4(), raw_refresh, revoked=True)
    mock_token_repo.get_by_hash = AsyncMock(return_value=stored_token)

    with pytest.raises(HTTPException) as exc_info:
        await service.refresh(raw_refresh)

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_refresh_expired_token_raises_401(service, mock_token_repo):
    """D-3: expired token raises 401."""
    raw_refresh = "expired_raw_token"
    stored_token = _make_refresh_token_record(uuid.uuid4(), raw_refresh, expired=True)
    mock_token_repo.get_by_hash = AsyncMock(return_value=stored_token)

    with pytest.raises(HTTPException) as exc_info:
        await service.refresh(raw_refresh)

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_refresh_unknown_token_raises_401(service, mock_token_repo):
    """D-5: hash not found in DB raises 401."""
    mock_token_repo.get_by_hash = AsyncMock(return_value=None)

    with pytest.raises(HTTPException) as exc_info:
        await service.refresh("completely_unknown_token")

    assert exc_info.value.status_code == 401


@pytest.mark.asyncio
async def test_refresh_rotates_token(service, mock_user_repo, mock_token_repo):
    """D-1: rotation — revoke_all_for_user called AND token_repo.save called with new token."""
    user_id = uuid.uuid4()
    raw_refresh = "raw_token_to_rotate"
    stored_token = _make_refresh_token_record(user_id, raw_refresh)
    user = _make_user()
    user.id = user_id

    mock_token_repo.get_by_hash = AsyncMock(return_value=stored_token)
    mock_user_repo.get_by_id = AsyncMock(return_value=user)

    saved_tokens = []

    async def capture_token_save(t):
        saved_tokens.append(t)
        return t

    mock_token_repo.save = capture_token_save

    _, new_raw = await service.refresh(raw_refresh)

    mock_token_repo.revoke_all_for_user.assert_called_once_with(user_id)
    assert len(saved_tokens) == 1
    expected_new_hash = hashlib.sha256(new_raw.encode()).hexdigest()
    assert saved_tokens[0].token_hash == expected_new_hash
