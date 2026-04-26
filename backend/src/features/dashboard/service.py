import uuid
from datetime import date
from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from src.features.transactions.repository import TransactionRepository


class DashboardService:
    def __init__(self, transaction_repo: TransactionRepository):
        self.transaction_repo = transaction_repo

    async def get_dashboard(
        self,
        user_id: uuid.UUID,
        start_date: date | None = None,
        end_date: date | None = None
    ) -> dict:
        """
        Get dashboard data for a user.
        
        Returns:
            Dictionary with balance, income, expense, recent transactions,
            and category breakdowns.
        """
        # Get balance summary
        balance_data = await self.transaction_repo.get_user_balance(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date
        )

        # Get recent transactions
        recent_transactions = await self.transaction_repo.get_by_user(
            user_id=user_id,
            limit=5
        )

        # Get category breakdowns
        expense_breakdown = await self.transaction_repo.get_category_breakdown(
            user_id=user_id,
            transaction_type="expense",
            start_date=start_date,
            end_date=end_date
        )

        income_breakdown = await self.transaction_repo.get_category_breakdown(
            user_id=user_id,
            transaction_type="income",
            start_date=start_date,
            end_date=end_date
        )

        return {
            "balance": str(balance_data["balance"]),
            "income": str(balance_data["income"]),
            "expense": str(balance_data["expense"]),
            "recent_transactions": [
                {
                    "id": str(t.id),
                    "amount": str(t.amount),
                    "type": t.type,
                    "description": t.description,
                    "date": t.transaction_date.isoformat(),
                }
                for t in recent_transactions
            ],
            "expense_by_category": expense_breakdown,
            "income_by_category": income_breakdown,
        }
