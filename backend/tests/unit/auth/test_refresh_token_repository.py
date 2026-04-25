"""
T-017: Failing unit tests for RefreshTokenRepository.
Uses a real in-memory SQLite DB — repositories are DB adapters, test with real DB.
"""
import pytest
import pytest_asyncio
import uuid
from datetime import datetime, timedelta

TEST_DB_URL = "sqlite+aiosqlite:///./test_refresh_token_repo.db"


@pytest_asyncio.fixture(loop_scope="function")
async def db_session():
    import os
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    # Import models FIRST to ensure they are registered on Base.metadata
    import src.features.auth.model  # noqa: F401
    from src.shared.database import Base

    db_path = os.path.abspath("./test_refresh_token_repo.db")
    if os.path.exists(db_path):
        os.remove(db_path)

    engine = create_async_engine(TEST_DB_URL, echo=False, poolclass=NullPool)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    session_factory = async_sessionmaker(engine, expire_on_commit=False)
    async with session_factory() as session:
        yield session
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    await engine.dispose()
    if os.path.exists(db_path):
        os.remove(db_path)


def _make_user(email: str = "user@example.com"):
    from src.features.auth.model import User
    return User(email=email, hashed_password="hashed_pw", role="user")


def _make_token(user_id: uuid.UUID, token_hash: str = "abc123"):
    from src.features.auth.model import RefreshToken
    return RefreshToken(
        user_id=user_id,
        token_hash=token_hash,
        expires_at=datetime.utcnow() + timedelta(days=1),
        revoked=False,
    )


class TestRefreshTokenRepository:
    """Integration-style unit tests — RefreshTokenRepository against real in-memory SQLite."""

    @pytest.mark.asyncio
    async def test_save_token(self, db_session):
        """save a RefreshToken returns the saved token with an id."""
        from src.features.auth.repository import UserRepository, RefreshTokenRepository

        user_repo = UserRepository(db_session)
        saved_user = await user_repo.save(_make_user())

        token_repo = RefreshTokenRepository(db_session)
        token = _make_token(saved_user.id, token_hash="hash-001")
        saved_token = await token_repo.save(token)

        assert saved_token.id is not None
        assert saved_token.token_hash == "hash-001"
        assert saved_token.user_id == saved_user.id

    @pytest.mark.asyncio
    async def test_get_by_hash_found(self, db_session):
        """get_by_hash with an existing hash returns the token."""
        from src.features.auth.repository import UserRepository, RefreshTokenRepository

        user_repo = UserRepository(db_session)
        saved_user = await user_repo.save(_make_user())

        token_repo = RefreshTokenRepository(db_session)
        await token_repo.save(_make_token(saved_user.id, token_hash="find-me"))

        found = await token_repo.get_by_hash("find-me")

        assert found is not None
        assert found.token_hash == "find-me"
        assert found.user_id == saved_user.id

    @pytest.mark.asyncio
    async def test_get_by_hash_not_found(self, db_session):
        """get_by_hash with an unknown hash returns None."""
        from src.features.auth.repository import RefreshTokenRepository

        token_repo = RefreshTokenRepository(db_session)
        result = await token_repo.get_by_hash("does-not-exist")

        assert result is None

    @pytest.mark.asyncio
    async def test_revoke_token(self, db_session):
        """revoke sets revoked=True on the specific token."""
        from src.features.auth.repository import UserRepository, RefreshTokenRepository

        user_repo = UserRepository(db_session)
        saved_user = await user_repo.save(_make_user())

        token_repo = RefreshTokenRepository(db_session)
        saved_token = await token_repo.save(_make_token(saved_user.id, token_hash="revoke-me"))

        await token_repo.revoke(saved_token.id)

        refreshed = await token_repo.get_by_hash("revoke-me")
        assert refreshed is not None
        assert refreshed.revoked is True

    @pytest.mark.asyncio
    async def test_revoke_all_for_user(self, db_session):
        """revoke_all_for_user marks all active tokens for the user as revoked."""
        from src.features.auth.repository import UserRepository, RefreshTokenRepository

        user_repo = UserRepository(db_session)
        saved_user = await user_repo.save(_make_user())

        token_repo = RefreshTokenRepository(db_session)
        await token_repo.save(_make_token(saved_user.id, token_hash="token-a"))
        await token_repo.save(_make_token(saved_user.id, token_hash="token-b"))

        await token_repo.revoke_all_for_user(saved_user.id)

        token_a = await token_repo.get_by_hash("token-a")
        token_b = await token_repo.get_by_hash("token-b")
        assert token_a is not None and token_a.revoked is True
        assert token_b is not None and token_b.revoked is True

    @pytest.mark.asyncio
    async def test_revoke_all_only_affects_target_user(self, db_session):
        """revoke_all_for_user does NOT revoke tokens belonging to other users."""
        from src.features.auth.repository import UserRepository, RefreshTokenRepository

        user_repo = UserRepository(db_session)
        user1 = await user_repo.save(_make_user("user1@example.com"))
        user2 = await user_repo.save(_make_user("user2@example.com"))

        token_repo = RefreshTokenRepository(db_session)
        await token_repo.save(_make_token(user1.id, token_hash="u1-token"))
        await token_repo.save(_make_token(user2.id, token_hash="u2-token"))

        await token_repo.revoke_all_for_user(user1.id)

        u1_token = await token_repo.get_by_hash("u1-token")
        u2_token = await token_repo.get_by_hash("u2-token")
        assert u1_token is not None and u1_token.revoked is True
        assert u2_token is not None and u2_token.revoked is False
