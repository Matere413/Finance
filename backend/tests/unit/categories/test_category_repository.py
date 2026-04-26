"""
T-026: Failing unit tests for CategoryRepository.
Uses a real in-memory SQLite DB.
"""
import pytest
import pytest_asyncio
import uuid

TEST_DB_URL = "sqlite+aiosqlite:///./test_category_repo.db"


@pytest_asyncio.fixture
async def db_session():
    import os
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    # Import models FIRST to ensure they are registered on Base.metadata
    import src.features.auth.model  # noqa: F401
    import src.features.categories.model  # noqa: F401
    from src.shared.database import Base

    db_path = os.path.abspath("./test_category_repo.db")
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


class TestCategoryRepository:
    """Integration-style unit tests — CategoryRepository against real in-memory SQLite."""

    @pytest.mark.asyncio
    async def test_save_and_get_by_id(self, db_session):
        """save a Category then get_by_id returns the same category."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        # Create a user first
        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = CategoryRepository(db_session)
        category = Category(
            user_id=user.id,
            name="Food",
            type="expense",
            icon="utensils",
            color="#FF5733",
            is_default=False,
        )
        saved = await repo.save(category)
        found = await repo.get_by_id(saved.id)

        assert found is not None
        assert found.id == saved.id
        assert found.name == "Food"
        assert found.type == "expense"

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, db_session):
        """get_by_id for a random UUID that doesn't exist returns None."""
        from src.features.categories.repository import CategoryRepository

        repo = CategoryRepository(db_session)
        result = await repo.get_by_id(uuid.uuid4())

        assert result is None

    @pytest.mark.asyncio
    async def test_get_by_user(self, db_session):
        """get_by_user returns all categories for a specific user."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        # Create users
        user1 = User(email="user1@example.com", hashed_password="hashed_pw", role="user")
        user2 = User(email="user2@example.com", hashed_password="hashed_pw", role="user")
        db_session.add_all([user1, user2])
        await db_session.commit()
        await db_session.refresh(user1)
        await db_session.refresh(user2)

        repo = CategoryRepository(db_session)
        cat1 = Category(user_id=user1.id, name="Food", type="expense", icon="utensils", color="#FF5733")
        cat2 = Category(user_id=user1.id, name="Salary", type="income", icon="dollar", color="#33FF57")
        cat3 = Category(user_id=user2.id, name="Transport", type="expense", icon="car", color="#3357FF")
        await repo.save(cat1)
        await repo.save(cat2)
        await repo.save(cat3)

        user1_cats = await repo.get_by_user(user1.id)
        assert len(user1_cats) == 2
        names = {c.name for c in user1_cats}
        assert names == {"Food", "Salary"}

    @pytest.mark.asyncio
    async def test_get_by_user_and_type(self, db_session):
        """get_by_user_and_type returns categories filtered by type."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = CategoryRepository(db_session)
        cat1 = Category(user_id=user.id, name="Food", type="expense", icon="utensils", color="#FF5733")
        cat2 = Category(user_id=user.id, name="Salary", type="income", icon="dollar", color="#33FF57")
        cat3 = Category(user_id=user.id, name="Transport", type="expense", icon="car", color="#3357FF")
        await repo.save(cat1)
        await repo.save(cat2)
        await repo.save(cat3)

        expense_cats = await repo.get_by_user_and_type(user.id, "expense")
        assert len(expense_cats) == 2
        assert all(c.type == "expense" for c in expense_cats)

    @pytest.mark.asyncio
    async def test_update(self, db_session):
        """update modifies an existing category."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = CategoryRepository(db_session)
        category = Category(user_id=user.id, name="Food", type="expense", icon="utensils", color="#FF5733")
        saved = await repo.save(category)

        # Update the category
        saved.name = "Groceries"
        saved.color = "#00FF00"
        updated = await repo.update(saved)

        assert updated.name == "Groceries"
        assert updated.color == "#00FF00"

    @pytest.mark.asyncio
    async def test_delete(self, db_session):
        """delete removes a category."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = CategoryRepository(db_session)
        category = Category(user_id=user.id, name="Food", type="expense", icon="utensils", color="#FF5733")
        saved = await repo.save(category)

        await repo.delete(saved.id)
        found = await repo.get_by_id(saved.id)
        assert found is None

    @pytest.mark.asyncio
    async def test_get_default_categories(self, db_session):
        """get_default_categories returns categories where is_default=True."""
        from src.features.categories.model import Category
        from src.features.categories.repository import CategoryRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = CategoryRepository(db_session)
        cat1 = Category(user_id=user.id, name="Food", type="expense", icon="utensils", color="#FF5733", is_default=True)
        cat2 = Category(user_id=user.id, name="Custom", type="expense", icon="star", color="#FF0000", is_default=False)
        await repo.save(cat1)
        await repo.save(cat2)

        defaults = await repo.get_default_categories(user.id)
        assert len(defaults) == 1
        assert defaults[0].name == "Food"
