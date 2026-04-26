import pytest
import inspect
from unittest.mock import patch, MagicMock
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker


class TestGetDb:
    """Tests for the async database session factory."""

    def test_get_db_is_async_generator(self):
        """get_db() must be an async generator function."""
        from src.shared.database import get_db
        assert inspect.isasyncgenfunction(get_db)

    @pytest.mark.asyncio
    async def test_get_db_yields_async_session(self):
        """get_db() yields an AsyncSession instance when called."""
        # Create an in-memory engine and session factory for testing
        test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
        TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)

        with patch("src.shared.database.AsyncSessionLocal", TestSessionLocal):
            from src.shared.database import get_db
            async for session in get_db():
                assert isinstance(session, AsyncSession)

        await test_engine.dispose()

    @pytest.mark.asyncio
    async def test_get_db_yields_exactly_one_session(self):
        """get_db() yields exactly one session per call."""
        test_engine = create_async_engine("sqlite+aiosqlite:///:memory:", echo=False)
        TestSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)

        with patch("src.shared.database.AsyncSessionLocal", TestSessionLocal):
            from src.shared.database import get_db
            sessions = []
            async for session in get_db():
                sessions.append(session)
            assert len(sessions) == 1

        await test_engine.dispose()
