"""
T-031: Failing unit tests for TransactionRepository.
Uses a real in-memory SQLite DB.
"""
import pytest
import pytest_asyncio
import uuid
from decimal import Decimal
from datetime import date

TEST_DB_URL = "sqlite+aiosqlite:///./test_transaction_repo.db"


@pytest_asyncio.fixture
async def db_session():
    import os
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
    from sqlalchemy.pool import NullPool
    # Import models FIRST to ensure they are registered on Base.metadata
    import src.features.auth.model  # noqa: F401
    import src.features.categories.model  # noqa: F401
    import src.features.transactions.model  # noqa: F401
    from src.shared.database import Base

    db_path = os.path.abspath("./test_transaction_repo.db")
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


class TestTransactionRepository:
    """Integration-style unit tests — TransactionRepository against real in-memory SQLite."""

    @pytest.mark.asyncio
    async def test_save_and_get_by_id(self, db_session):
        """save a Transaction then get_by_id returns the same transaction."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        # Create a user first
        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = TransactionRepository(db_session)
        transaction = Transaction(
            user_id=user.id,
            amount=Decimal("100.50"),
            type="expense",
            description="Groceries",
            transaction_date=date(2024, 1, 15),
        )
        saved = await repo.save(transaction)
        found = await repo.get_by_id(saved.id)

        assert found is not None
        assert found.id == saved.id
        assert found.amount == Decimal("100.50")
        assert found.type == "expense"

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, db_session):
        """get_by_id for a random UUID that doesn't exist returns None."""
        from src.features.transactions.repository import TransactionRepository

        repo = TransactionRepository(db_session)
        result = await repo.get_by_id(uuid.uuid4())

        assert result is None

    @pytest.mark.asyncio
    async def test_get_by_user(self, db_session):
        """get_by_user returns all transactions for a specific user."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        # Create users
        user1 = User(email="user1@example.com", hashed_password="hashed_pw", role="user")
        user2 = User(email="user2@example.com", hashed_password="hashed_pw", role="user")
        db_session.add_all([user1, user2])
        await db_session.commit()
        await db_session.refresh(user1)
        await db_session.refresh(user2)

        repo = TransactionRepository(db_session)
        t1 = Transaction(user_id=user1.id, amount=Decimal("100"), type="expense", transaction_date=date(2024, 1, 15))
        t2 = Transaction(user_id=user1.id, amount=Decimal("200"), type="income", transaction_date=date(2024, 1, 16))
        t3 = Transaction(user_id=user2.id, amount=Decimal("50"), type="expense", transaction_date=date(2024, 1, 17))
        await repo.save(t1)
        await repo.save(t2)
        await repo.save(t3)

        user1_transactions = await repo.get_by_user(user1.id)
        assert len(user1_transactions) == 2

    @pytest.mark.asyncio
    async def test_get_by_user_filtered_by_type(self, db_session):
        """get_by_user with type filter returns only matching transactions."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = TransactionRepository(db_session)
        t1 = Transaction(user_id=user.id, amount=Decimal("100"), type="expense", transaction_date=date(2024, 1, 15))
        t2 = Transaction(user_id=user.id, amount=Decimal("200"), type="income", transaction_date=date(2024, 1, 16))
        t3 = Transaction(user_id=user.id, amount=Decimal("50"), type="expense", transaction_date=date(2024, 1, 17))
        await repo.save(t1)
        await repo.save(t2)
        await repo.save(t3)

        expense_transactions = await repo.get_by_user(user.id, transaction_type="expense")
        assert len(expense_transactions) == 2
        assert all(t.type == "expense" for t in expense_transactions)

    @pytest.mark.asyncio
    async def test_update(self, db_session):
        """update modifies an existing transaction."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = TransactionRepository(db_session)
        transaction = Transaction(user_id=user.id, amount=Decimal("100"), type="expense", transaction_date=date(2024, 1, 15))
        saved = await repo.save(transaction)

        # Update the transaction
        saved.amount = Decimal("150")
        saved.description = "Updated description"
        updated = await repo.update(saved)

        assert updated.amount == Decimal("150")
        assert updated.description == "Updated description"

    @pytest.mark.asyncio
    async def test_delete(self, db_session):
        """delete removes a transaction."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = TransactionRepository(db_session)
        transaction = Transaction(user_id=user.id, amount=Decimal("100"), type="expense", transaction_date=date(2024, 1, 15))
        saved = await repo.save(transaction)

        await repo.delete(saved.id)
        found = await repo.get_by_id(saved.id)
        assert found is None

    @pytest.mark.asyncio
    async def test_get_user_balance(self, db_session):
        """get_user_balance calculates correct income, expense, and balance."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.repository import TransactionRepository
        from src.features.auth.model import User

        user = User(email="test@example.com", hashed_password="hashed_pw", role="user")
        db_session.add(user)
        await db_session.commit()
        await db_session.refresh(user)

        repo = TransactionRepository(db_session)
        t1 = Transaction(user_id=user.id, amount=Decimal("1000"), type="income", transaction_date=date(2024, 1, 15))
        t2 = Transaction(user_id=user.id, amount=Decimal("300"), type="expense", transaction_date=date(2024, 1, 16))
        t3 = Transaction(user_id=user.id, amount=Decimal("200"), type="expense", transaction_date=date(2024, 1, 17))
        await repo.save(t1)
        await repo.save(t2)
        await repo.save(t3)

        balance_data = await repo.get_user_balance(user.id)
        assert balance_data["income"] == Decimal("1000")
        assert balance_data["expense"] == Decimal("500")
        assert balance_data["balance"] == Decimal("500")
