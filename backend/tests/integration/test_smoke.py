import pytest
from httpx import AsyncClient


class TestAuthSmoke:
    async def test_full_auth_flow(self, client: AsyncClient):
        """Complete auth lifecycle: register → login → me → refresh → logout → refresh fails."""
        # 1. Register
        register_resp = await client.post("/auth/register", json={
            "email": "smoke@test.com",
            "password": "smokepass123"
        })
        assert register_resp.status_code == 201
        user_id = register_resp.json()["id"]

        # 2. Login
        login_resp = await client.post("/auth/login", json={
            "email": "smoke@test.com",
            "password": "smokepass123"
        })
        assert login_resp.status_code == 200
        access_token = login_resp.json()["access_token"]
        assert "refresh_token" in login_resp.cookies

        # 3. /me with valid token
        me_resp = await client.get("/auth/me", headers={"Authorization": f"Bearer {access_token}"})
        assert me_resp.status_code == 200
        assert me_resp.json()["email"] == "smoke@test.com"

        # 4. Refresh — a new access token is issued (token rotation)
        refresh_resp = await client.post("/auth/refresh")
        assert refresh_resp.status_code == 200
        new_access_token = refresh_resp.json()["access_token"]
        assert new_access_token  # non-empty token issued

        # 5. Logout
        logout_resp = await client.post("/auth/logout", headers={"Authorization": f"Bearer {new_access_token}"})
        assert logout_resp.status_code == 200

        # 6. After logout, refresh should fail (token revoked in DB)
        refresh_after_logout = await client.post("/auth/refresh")
        assert refresh_after_logout.status_code == 401
