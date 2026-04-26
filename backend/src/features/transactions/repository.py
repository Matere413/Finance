import uuid
from datetime import date
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, func
from sqlalchemy.orm import selectinload
from src.features.transactions.model import Transaction


class TransactionRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, transaction_id: uuid.UUID) -> Transaction | None:
        result = await self.session.execute(
            select(Transaction).where(Transaction.id == transaction_id)
        )
        return result.scalar_one_or_none()

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
        query = select(Transaction).where(Transaction.user_id == user_id)

        if start_date:
            query = query.where(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.where(Transaction.transaction_date <= end_date)
        if transaction_type:
            query = query.where(Transaction.type == transaction_type)
        if category_id:
            query = query.where(Transaction.category_id == category_id)

        query = query.order_by(Transaction.transaction_date.desc())
        query = query.offset(offset).limit(limit)

        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_by_user_with_category(self, user_id: uuid.UUID, limit: int = 100) -> list[Transaction]:
        """Get transactions with category data (for N+1 prevention)."""
        from src.features.categories.model import Category
        result = await self.session.execute(
            select(Transaction, Category)
            .outerjoin(Category, Transaction.category_id == Category.id)
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.transaction_date.desc())
            .limit(limit)
        )
        return [(row[0], row[1]) for row in result.all()]

    async def save(self, transaction: Transaction) -> Transaction:
        self.session.add(transaction)
        await self.session.commit()
        await self.session.refresh(transaction)
        return transaction

    async def update(self, transaction: Transaction) -> Transaction:
        await self.session.commit()
        await self.session.refresh(transaction)
        return transaction

    async def delete(self, transaction_id: uuid.UUID) -> None:
        result = await self.session.execute(
            select(Transaction).where(Transaction.id == transaction_id)
        )
        transaction = result.scalar_one_or_none()
        if transaction:
            await self.session.delete(transaction)
            await self.session.commit()

    async def get_user_balance(
        self,
        user_id: uuid.UUID,
        start_date: date | None = None,
        end_date: date | None = None
    ) -> dict[str, Decimal]:
        """Calculate income, expense, and balance for a user."""
        query = select(
            Transaction.type,
            func.sum(Transaction.amount).label("total")
        ).where(Transaction.user_id == user_id)

        if start_date:
            query = query.where(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.where(Transaction.transaction_date <= end_date)

        query = query.group_by(Transaction.type)
        result = await self.session.execute(query)
        rows = result.all()

        income = Decimal("0")
        expense = Decimal("0")

        for row in rows:
            if row.type == "income":
                income = row.total or Decimal("0")
            elif row.type == "expense":
                expense = row.total or Decimal("0")

        return {
            "income": income,
            "expense": expense,
            "balance": income - expense
        }

    async def get_category_breakdown(
        self,
        user_id: uuid.UUID,
        transaction_type: str,
        start_date: date | None = None,
        end_date: date | None = None
    ) -> list[dict]:
        """Get breakdown by category for a transaction type."""
        from src.features.categories.model import Category
        query = select(
            Category.name.label("category_name"),
            Category.color.label("category_color"),
            func.sum(Transaction.amount).label("total")
        ).select_from(Transaction).outerjoin(
            Category, Transaction.category_id == Category.id
        ).where(
            Transaction.user_id == user_id,
            Transaction.type == transaction_type
        )

        if start_date:
            query = query.where(Transaction.transaction_date >= start_date)
        if end_date:
            query = query.where(Transaction.transaction_date <= end_date)

        query = query.group_by(Category.id, Category.name, Category.color)
        query = query.order_by(func.sum(Transaction.amount).desc())

        result = await self.session.execute(query)
        rows = result.all()

        return [
            {
                "category_name": row.category_name or "Uncategorized",
                "category_color": row.category_color or "#808080",
                "total": row.total or Decimal("0")
            }
            for row in rows
        ]
