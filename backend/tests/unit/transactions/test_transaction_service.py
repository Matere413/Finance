"""
T-033: Failing unit tests for TransactionService.
"""
import uuid
import pytest
from decimal import Decimal
from datetime import date
from unittest.mock import AsyncMock, MagicMock


class TestTransactionService:
    """Unit tests for TransactionService with mocked repository."""

    @pytest.fixture
    def mock_repo(self):
        """Create a mock TransactionRepository."""
        repo = MagicMock()
        repo.save = AsyncMock()
        repo.get_by_id = AsyncMock()
        repo.get_by_user = AsyncMock()
        repo.update = AsyncMock()
        repo.delete = AsyncMock()
        repo.get_user_balance = AsyncMock()
        return repo

    @pytest.fixture
    def service(self, mock_repo):
        """Create a TransactionService with mocked repository."""
        from src.features.transactions.service import TransactionService
        return TransactionService(mock_repo)

    @pytest.mark.asyncio
    async def test_create_transaction_success(self, service, mock_repo):
        """Creating a transaction with valid data succeeds."""
        from src.features.transactions.schemas import TransactionCreate
        from src.features.transactions.model import Transaction

        user_id = uuid.uuid4()
        data = TransactionCreate(
            amount=Decimal("100.50"),
            type="expense",
            description="Groceries",
            date=date(2024, 1, 15),
        )

        mock_repo.save.return_value = Transaction(
            id=uuid.uuid4(),
            user_id=user_id,
            amount=Decimal("100.50"),
            type="expense",
            description="Groceries",
            transaction_date=date(2024, 1, 15),
        )

        result = await service.create(user_id, data)

        assert result.amount == Decimal("100.50")
        assert result.type == "expense"
        mock_repo.save.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_by_id_success(self, service, mock_repo):
        """Getting a transaction by ID returns the transaction if owned by user."""
        from src.features.transactions.model import Transaction

        user_id = uuid.uuid4()
        transaction_id = uuid.uuid4()
        transaction = Transaction(
            id=transaction_id,
            user_id=user_id,
            amount=Decimal("100"),
            type="expense",
            transaction_date=date(2024, 1, 15),
        )
        mock_repo.get_by_id.return_value = transaction

        result = await service.get_by_id(transaction_id, user_id)

        assert result.id == transaction_id
        assert result.user_id == user_id

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, service, mock_repo):
        """Getting a non-existent transaction raises 404."""
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        transaction_id = uuid.uuid4()
        mock_repo.get_by_id.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await service.get_by_id(transaction_id, user_id)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_get_by_id_wrong_user(self, service, mock_repo):
        """Getting a transaction owned by another user raises 404."""
        from src.features.transactions.model import Transaction
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        other_user_id = uuid.uuid4()
        transaction_id = uuid.uuid4()
        transaction = Transaction(
            id=transaction_id,
            user_id=other_user_id,
            amount=Decimal("100"),
            type="expense",
            transaction_date=date(2024, 1, 15),
        )
        mock_repo.get_by_id.return_value = transaction

        with pytest.raises(HTTPException) as exc_info:
            await service.get_by_id(transaction_id, user_id)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_update_success(self, service, mock_repo):
        """Updating a transaction modifies the data."""
        from src.features.transactions.model import Transaction
        from src.features.transactions.schemas import TransactionUpdate

        user_id = uuid.uuid4()
        transaction_id = uuid.uuid4()
        transaction = Transaction(
            id=transaction_id,
            user_id=user_id,
            amount=Decimal("100"),
            type="expense",
            transaction_date=date(2024, 1, 15),
        )
        mock_repo.get_by_id.return_value = transaction
        mock_repo.update.return_value = transaction

        data = TransactionUpdate(amount=Decimal("150"))
        result = await service.update(transaction_id, user_id, data)

        assert result.amount == Decimal("150")

    @pytest.mark.asyncio
    async def test_delete_success(self, service, mock_repo):
        """Deleting a transaction removes it."""
        from src.features.transactions.model import Transaction

        user_id = uuid.uuid4()
        transaction_id = uuid.uuid4()
        transaction = Transaction(
            id=transaction_id,
            user_id=user_id,
            amount=Decimal("100"),
            type="expense",
            transaction_date=date(2024, 1, 15),
        )
        mock_repo.get_by_id.return_value = transaction

        await service.delete(transaction_id, user_id)

        mock_repo.delete.assert_called_once_with(transaction_id)
