"""
T-036 — Integration tests for POST /auth/refresh
Spec scenarios D-1 through D-5.
"""
import hashlib
from datetime import datetime, timedelta, timezone

import pytest
from sqlalchemy import select


REGISTER_URL = "/auth/register"
LOGIN_URL = "/auth/login"
REFRESH_URL = "/auth/refresh"
VALID_USER = {"email": "user@test.com", "password": "securepassword"}


async def _register_login_get_cookie(client):
    await client.post(REGISTER_URL, json=VALID_USER)
    response = await client.post(LOGIN_URL, json=VALID_USER)
    return response.cookies.get("refresh_token")


# D-1: success → 200, new access_token, new refresh_token cookie
@pytest.mark.asyncio
async def test_refresh_success(client):
    cookie_value = await _register_login_get_cookie(client)
    assert cookie_value is not None

    response = await client.post(
        REFRESH_URL,
        cookies={"refresh_token": cookie_value},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert "refresh_token" in response.cookies


# D-2: missing cookie → 401
@pytest.mark.asyncio
async def test_refresh_missing_cookie(client):
    response = await client.post(REFRESH_URL)
    assert response.status_code == 401


# D-3: expired token in DB → 401, cookie cleared
@pytest.mark.asyncio
async def test_refresh_expired_token(client, test_db):
    from src.features.auth.model import RefreshToken

    cookie_value = await _register_login_get_cookie(client)
    token_hash = hashlib.sha256(cookie_value.encode()).hexdigest()

    # Expire the token directly in DB
    async with test_db() as session:
        result = await session.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        token = result.scalar_one()
        token.expires_at = datetime.now(timezone.utc) - timedelta(seconds=10)
        await session.commit()

    response = await client.post(
        REFRESH_URL,
        cookies={"refresh_token": cookie_value},
    )
    assert response.status_code == 401
    # Cookie should be cleared
    set_cookie = response.headers.get("set-cookie", "")
    assert "refresh_token" in set_cookie


# D-4: revoked token → 401, cookie cleared
@pytest.mark.asyncio
async def test_refresh_revoked_token(client, test_db):
    from src.features.auth.model import RefreshToken

    cookie_value = await _register_login_get_cookie(client)
    token_hash = hashlib.sha256(cookie_value.encode()).hexdigest()

    # Revoke the token
    async with test_db() as session:
        result = await session.execute(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        token = result.scalar_one()
        token.revoked = True
        await session.commit()

    response = await client.post(
        REFRESH_URL,
        cookies={"refresh_token": cookie_value},
    )
    assert response.status_code == 401
    set_cookie = response.headers.get("set-cookie", "")
    assert "refresh_token" in set_cookie


# D-5: token rotation — old token rejected after refresh
@pytest.mark.asyncio
async def test_refresh_token_rotation(client):
    old_cookie = await _register_login_get_cookie(client)
    assert old_cookie is not None

    # First refresh — should succeed and rotate
    r1 = await client.post(
        REFRESH_URL,
        cookies={"refresh_token": old_cookie},
    )
    assert r1.status_code == 200

    # Use old cookie again — should be rejected
    r2 = await client.post(
        REFRESH_URL,
        cookies={"refresh_token": old_cookie},
    )
    assert r2.status_code == 401
