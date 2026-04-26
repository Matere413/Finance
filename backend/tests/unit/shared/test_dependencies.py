"""
T-027 — Failing unit tests for get_current_user dependency.
Uses mocked UserRepository + real JWT encoding.
All imports are lazy (inside fixtures/functions) to avoid collection-time issues.
"""
import uuid
from datetime import datetime, timedelta, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi import HTTPException


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def _make_user(is_active: bool = True):
    """Build a minimal User-like object without importing the model at collection time."""
    user = MagicMock()
    user.id = uuid.uuid4()
    user.email = "user@test.com"
    user.is_active = is_active
    return user


def _encode_token(user_id: uuid.UUID, *, expired: bool = False) -> str:
    """Encode a real JWT using jose — same algorithm as AuthService."""
    from jose import jwt

    secret = "test-secret-key-32-characters-long"
    exp = datetime.now(timezone.utc) + (
        timedelta(seconds=-10) if expired else timedelta(minutes=30)
    )
    return jwt.encode({"sub": str(user_id), "exp": exp}, secret, algorithm="HS256")


# ---------------------------------------------------------------------------
# T-027-a: valid Bearer JWT → returns User
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_current_user_valid_token():
    from src.shared.dependencies import get_current_user

    user = _make_user()
    token = _encode_token(user.id)

    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value=user)

    mock_db = AsyncMock()

    # Patch UserRepository and get_db
    import unittest.mock as mock
    from src.shared import dependencies as dep

    with mock.patch.object(dep, "UserRepository", return_value=mock_repo):
        result = await get_current_user(token=token, db=mock_db)

    assert result is user


# ---------------------------------------------------------------------------
# T-027-b: malformed token → raises HTTPException 401
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_current_user_invalid_token():
    from src.shared.dependencies import get_current_user
    import unittest.mock as mock
    from src.shared import dependencies as dep

    mock_repo = AsyncMock()
    mock_db = AsyncMock()

    with mock.patch.object(dep, "UserRepository", return_value=mock_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token="not.a.valid.token", db=mock_db)

    assert exc_info.value.status_code == 401


# ---------------------------------------------------------------------------
# T-027-c: expired JWT → raises HTTPException 401
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_current_user_expired_token():
    from src.shared.dependencies import get_current_user
    import unittest.mock as mock
    from src.shared import dependencies as dep

    user_id = uuid.uuid4()
    token = _encode_token(user_id, expired=True)

    mock_repo = AsyncMock()
    mock_db = AsyncMock()

    with mock.patch.object(dep, "UserRepository", return_value=mock_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=token, db=mock_db)

    assert exc_info.value.status_code == 401


# ---------------------------------------------------------------------------
# T-027-d: valid JWT but user_id not in DB → raises HTTPException 401
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_current_user_user_not_found():
    from src.shared.dependencies import get_current_user
    import unittest.mock as mock
    from src.shared import dependencies as dep

    user_id = uuid.uuid4()
    token = _encode_token(user_id)

    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value=None)
    mock_db = AsyncMock()

    with mock.patch.object(dep, "UserRepository", return_value=mock_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=token, db=mock_db)

    assert exc_info.value.status_code == 401


# ---------------------------------------------------------------------------
# T-027-e: valid JWT but user.is_active=False → raises HTTPException 403
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_get_current_user_inactive_user():
    from src.shared.dependencies import get_current_user
    import unittest.mock as mock
    from src.shared import dependencies as dep

    user = _make_user(is_active=False)
    token = _encode_token(user.id)

    mock_repo = AsyncMock()
    mock_repo.get_by_id = AsyncMock(return_value=user)
    mock_db = AsyncMock()

    with mock.patch.object(dep, "UserRepository", return_value=mock_repo):
        with pytest.raises(HTTPException) as exc_info:
            await get_current_user(token=token, db=mock_db)

    assert exc_info.value.status_code == 403
