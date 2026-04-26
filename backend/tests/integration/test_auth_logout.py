"""
T-034 — Integration tests for POST /auth/logout
Spec scenarios C-1 through C-4.
"""
import uuid
from datetime import datetime, timedelta, timezone

import pytest


REGISTER_URL = "/auth/register"
LOGIN_URL = "/auth/login"
LOGOUT_URL = "/auth/logout"
VALID_USER = {"email": "user@test.com", "password": "securepassword"}


async def _register_and_login(client):
    await client.post(REGISTER_URL, json=VALID_USER)
    response = await client.post(LOGIN_URL, json=VALID_USER)
    return response.json()["access_token"]


# C-1: success → 200, refresh_token cookie is cleared
@pytest.mark.asyncio
async def test_logout_success(client):
    access_token = await _register_and_login(client)
    response = await client.post(
        LOGOUT_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    assert response.status_code == 200
    # Cookie should be deleted (set-cookie header with empty value or max-age=0)
    set_cookie = response.headers.get("set-cookie", "")
    assert "refresh_token" in set_cookie


# C-2: garbage Bearer token → 401
@pytest.mark.asyncio
async def test_logout_invalid_token(client):
    response = await client.post(
        LOGOUT_URL,
        headers={"Authorization": "Bearer not.a.valid.token"},
    )
    assert response.status_code == 401


# C-3: no Authorization header → 401
@pytest.mark.asyncio
async def test_logout_missing_auth_header(client):
    response = await client.post(LOGOUT_URL)
    assert response.status_code == 401


# C-4: expired JWT → 401
@pytest.mark.asyncio
async def test_logout_expired_token(client):
    from jose import jwt as jose_jwt

    secret = "test-secret-key-32-characters-long"
    expired_token = jose_jwt.encode(
        {
            "sub": str(uuid.uuid4()),
            "exp": datetime.now(timezone.utc) - timedelta(seconds=10),
        },
        secret,
        algorithm="HS256",
    )
    response = await client.post(
        LOGOUT_URL,
        headers={"Authorization": f"Bearer {expired_token}"},
    )
    assert response.status_code == 401
