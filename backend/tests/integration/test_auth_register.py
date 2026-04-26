"""
T-030 — Integration tests for POST /auth/register
Spec scenarios A-1 through A-8.
"""
import pytest


REGISTER_URL = "/auth/register"
VALID_PAYLOAD = {"email": "user@test.com", "password": "securepassword"}


# A-1: success → 201 with correct body shape
@pytest.mark.asyncio
async def test_register_success(client):
    response = await client.post(REGISTER_URL, json=VALID_PAYLOAD)
    assert response.status_code == 201
    body = response.json()
    assert "id" in body
    assert "email" in body
    assert "role" in body
    assert "created_at" in body


# A-2: duplicate email → 409
@pytest.mark.asyncio
async def test_register_duplicate_email(client):
    await client.post(REGISTER_URL, json=VALID_PAYLOAD)
    response = await client.post(REGISTER_URL, json=VALID_PAYLOAD)
    assert response.status_code == 409


# A-3: invalid email → 422
@pytest.mark.asyncio
async def test_register_invalid_email(client):
    response = await client.post(
        REGISTER_URL, json={"email": "notanemail", "password": "securepassword"}
    )
    assert response.status_code == 422


# A-4: password too short (7 chars) → 422
@pytest.mark.asyncio
async def test_register_password_too_short(client):
    response = await client.post(
        REGISTER_URL, json={"email": "user@test.com", "password": "short1"}
    )
    assert response.status_code == 422


# A-5: missing email → 422
@pytest.mark.asyncio
async def test_register_missing_email(client):
    response = await client.post(REGISTER_URL, json={"password": "securepassword"})
    assert response.status_code == 422


# A-6: missing password → 422
@pytest.mark.asyncio
async def test_register_missing_password(client):
    response = await client.post(REGISTER_URL, json={"email": "user@test.com"})
    assert response.status_code == 422


# A-7: email stored lowercase
@pytest.mark.asyncio
async def test_register_email_stored_lowercase(client):
    response = await client.post(
        REGISTER_URL,
        json={"email": "UPPER@TEST.COM", "password": "securepassword"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "upper@test.com"


# A-8: hashed_password / password not in response body
@pytest.mark.asyncio
async def test_register_password_not_in_response(client):
    response = await client.post(REGISTER_URL, json=VALID_PAYLOAD)
    assert response.status_code == 201
    body = response.json()
    assert "hashed_password" not in body
    assert "password" not in body
