"""
T-038 — Integration tests for GET /auth/me
Spec scenarios E-1 through E-4.
"""
import pytest
from sqlalchemy import select


REGISTER_URL = "/auth/register"
LOGIN_URL = "/auth/login"
ME_URL = "/auth/me"
VALID_USER = {"email": "user@test.com", "password": "securepassword"}


async def _register_and_get_token(client) -> str:
    await client.post(REGISTER_URL, json=VALID_USER)
    response = await client.post(LOGIN_URL, json=VALID_USER)
    return response.json()["access_token"]


# E-1: success → 200, correct user data
@pytest.mark.asyncio
async def test_me_success(client):
    token = await _register_and_get_token(client)
    response = await client.get(
        ME_URL, headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "user@test.com"
    assert "id" in body
    assert "role" in body
    assert "created_at" in body
    assert "hashed_password" not in body


# E-2: garbage token → 401
@pytest.mark.asyncio
async def test_me_invalid_token(client):
    response = await client.get(
        ME_URL, headers={"Authorization": "Bearer not.a.valid.token"}
    )
    assert response.status_code == 401


# E-3: no Authorization header → 401
@pytest.mark.asyncio
async def test_me_missing_token(client):
    response = await client.get(ME_URL)
    assert response.status_code == 401


# E-4: inactive user → 403
@pytest.mark.asyncio
async def test_me_inactive_user(client, test_db):
    from src.features.auth.model import User

    token = await _register_and_get_token(client)

    # Set user inactive
    async with test_db() as session:
        result = await session.execute(select(User).where(User.email == "user@test.com"))
        user = result.scalar_one()
        user.is_active = False
        await session.commit()

    response = await client.get(
        ME_URL, headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 403
