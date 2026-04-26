import uuid
from datetime import date
from decimal import Decimal
from fastapi import HTTPException, status
from src.features.transactions.model import Transaction
from src.features.transactions.repository import TransactionRepository
from src.features.transactions.schemas import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    async def create(self, user_id: uuid.UUID, data: TransactionCreate) -> Transaction:
        """Create a new transaction."""
        transaction = Transaction(
            user_id=user_id,
            category_id=data.category_id,
            amount=data.amount,
            type=data.type,
            description=data.description,
            transaction_date=data.date,
        )
        return await self.transaction_repo.save(transaction)

    async def get_by_id(self, transaction_id: uuid.UUID, user_id: uuid.UUID) -> Transaction:
        """Get a transaction by ID, verifying ownership."""
        transaction = await self.transaction_repo.get_by_id(transaction_id)
        if not transaction or transaction.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Transaction not found"
            )
        return transaction

    async def get_by_user(
        self,
        user_id: uuid.UUID,
        start_date: date | None = None,
        end_date: date | None = None,
        transaction_type: str | None = None,
        category_id: uuid.UUID | None = None,
        limit: int = 100,
        offset: int = 0
    ) -> list[Transaction]:
        """Get all transactions for a user with optional filters."""
        return await self.transaction_repo.get_by_user(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            transaction_type=transaction_type,
            category_id=category_id,
            limit=limit,
            offset=offset
        )

    async def update(
        self,
        transaction_id: uuid.UUID,
        user_id: uuid.UUID,
        data: TransactionUpdate
    ) -> Transaction:
        """Update a transaction."""
        transaction = await self.get_by_id(transaction_id, user_id)

        if data.amount is not None:
            transaction.amount = data.amount
        if data.type is not None:
            transaction.type = data.type
        if data.description is not None:
            transaction.description = data.description
        if data.date is not None:
            transaction.transaction_date = data.date
        if data.category_id is not None:
            transaction.category_id = data.category_id

        return await self.transaction_repo.update(transaction)

    async def delete(self, transaction_id: uuid.UUID, user_id: uuid.UUID) -> None:
        """Delete a transaction."""
        await self.get_by_id(transaction_id, user_id)  # Verify ownership
        await self.transaction_repo.delete(transaction_id)
