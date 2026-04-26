"""
T-032 — Integration tests for POST /auth/login
Spec scenarios B-1 through B-4.
"""
import pytest
from sqlalchemy import select


LOGIN_URL = "/auth/login"
REGISTER_URL = "/auth/register"
VALID_USER = {"email": "user@test.com", "password": "securepassword"}


async def _register_and_login(client, *, email="user@test.com", password="securepassword"):
    await client.post(REGISTER_URL, json={"email": email, "password": password})
    return await client.post(LOGIN_URL, json={"email": email, "password": password})


# B-1: success → 200, body has access_token and token_type, sets refresh_token cookie
@pytest.mark.asyncio
async def test_login_success(client):
    response = await _register_and_login(client)
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    assert "refresh_token" in response.cookies


# B-2: wrong password → 401
@pytest.mark.asyncio
async def test_login_wrong_password(client):
    await client.post(REGISTER_URL, json=VALID_USER)
    response = await client.post(
        LOGIN_URL, json={"email": "user@test.com", "password": "wrongpassword"}
    )
    assert response.status_code == 401


# B-3: non-existent email → 401, same error message as wrong password
@pytest.mark.asyncio
async def test_login_nonexistent_email(client):
    response_wrong_pw = await _register_and_login(client)
    wrong_pw_response = await client.post(
        LOGIN_URL, json={"email": "user@test.com", "password": "wrongpassword"}
    )
    response_unknown = await client.post(
        LOGIN_URL, json={"email": "nobody@test.com", "password": "securepassword"}
    )
    assert response_unknown.status_code == 401
    # Same error detail as wrong password
    assert response_unknown.json()["detail"] == wrong_pw_response.json()["detail"]


# W-2: refresh_token cookie must carry Path=/auth
@pytest.mark.asyncio
async def test_login_cookie_has_correct_path(client):
    response = await _register_and_login(client)
    assert response.status_code == 200
    set_cookie_header = response.headers.get("set-cookie", "")
    assert "refresh_token" in set_cookie_header
    assert "Path=/auth" in set_cookie_header, (
        f"Expected 'Path=/auth' in Set-Cookie header, got: {set_cookie_header}"
    )


# B-4: inactive user → 403
@pytest.mark.asyncio
async def test_login_inactive_user(client, test_db):
    from src.features.auth.model import User

    await client.post(REGISTER_URL, json=VALID_USER)

    # Manually set is_active=False
    async with test_db() as session:
        result = await session.execute(select(User).where(User.email == "user@test.com"))
        user = result.scalar_one()
        user.is_active = False
        await session.commit()

    response = await client.post(LOGIN_URL, json=VALID_USER)
    assert response.status_code == 403
    assert response.json()["detail"] == "Account is inactive"
