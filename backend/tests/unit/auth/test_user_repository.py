"""
T-015: Failing unit tests for UserRepository.
Uses a real in-memory SQLite DB — repositories are DB adapters, test with real DB.
"""
import pytest
import pytest_asyncio
import uuid

TEST_DB_URL = "sqlite+aiosqlite:///./test_user_repo.db"


@pytest_asyncio.fixture(loop_scope="function")
async def db_session():
    import os
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    # Import models FIRST to ensure they are registered on Base.metadata
    import src.features.auth.model  # noqa: F401
    from src.shared.database import Base

    db_path = os.path.abspath("./test_user_repo.db")
    # Remove leftover file from a previous failed run
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


class TestUserRepository:
    """Integration-style unit tests — UserRepository against real in-memory SQLite."""

    @pytest.mark.asyncio
    async def test_save_and_get_by_email(self, db_session):
        """save a User then get_by_email returns the same user."""
        from src.features.auth.model import User
        from src.features.auth.repository import UserRepository

        repo = UserRepository(db_session)
        user = User(
            email="alice@example.com",
            hashed_password="hashed_pw",
            role="user",
        )
        saved = await repo.save(user)
        found = await repo.get_by_email("alice@example.com")

        assert found is not None
        assert found.id == saved.id
        assert found.email == "alice@example.com"

    @pytest.mark.asyncio
    async def test_get_by_email_not_found(self, db_session):
        """get_by_email for non-existent email returns None."""
        from src.features.auth.repository import UserRepository

        repo = UserRepository(db_session)
        result = await repo.get_by_email("nobody@example.com")

        assert result is None

    @pytest.mark.asyncio
    async def test_get_by_id(self, db_session):
        """save a User then get_by_id returns the same user."""
        from src.features.auth.model import User
        from src.features.auth.repository import UserRepository

        repo = UserRepository(db_session)
        user = User(
            email="bob@example.com",
            hashed_password="hashed_pw",
            role="user",
        )
        saved = await repo.save(user)
        found = await repo.get_by_id(saved.id)

        assert found is not None
        assert found.id == saved.id
        assert found.email == "bob@example.com"

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, db_session):
        """get_by_id for a random UUID that doesn't exist returns None."""
        from src.features.auth.repository import UserRepository

        repo = UserRepository(db_session)
        result = await repo.get_by_id(uuid.uuid4())

        assert result is None

    @pytest.mark.asyncio
    async def test_save_duplicate_email_raises(self, db_session):
        """saving two Users with the same email raises an exception."""
        from src.features.auth.model import User
        from src.features.auth.repository import UserRepository

        repo = UserRepository(db_session)
        user1 = User(email="carol@example.com", hashed_password="pw1", role="user")
        await repo.save(user1)

        user2 = User(email="carol@example.com", hashed_password="pw2", role="user")
        with pytest.raises(Exception):
            await repo.save(user2)
