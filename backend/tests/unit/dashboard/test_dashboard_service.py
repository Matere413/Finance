"""
T-037: Failing unit tests for DashboardService.
"""
import uuid
import pytest
from decimal import Decimal
from datetime import date
from unittest.mock import AsyncMock, MagicMock


class TestDashboardService:
    """Unit tests for DashboardService with mocked repository."""

    @pytest.fixture
    def mock_repo(self):
        """Create a mock TransactionRepository."""
        repo = MagicMock()
        repo.get_user_balance = AsyncMock()
        repo.get_by_user = AsyncMock()
        repo.get_category_breakdown = AsyncMock()
        return repo

    @pytest.fixture
    def service(self, mock_repo):
        """Create a DashboardService with mocked repository."""
        from src.features.dashboard.service import DashboardService
        return DashboardService(mock_repo)

    @pytest.mark.asyncio
    async def test_get_dashboard_returns_correct_structure(self, service, mock_repo):
        """get_dashboard returns the expected structure with all data."""
        from src.features.transactions.model import Transaction

        user_id = uuid.uuid4()

        # Mock balance data
        mock_repo.get_user_balance.return_value = {
            "income": Decimal("1000.00"),
            "expense": Decimal("500.00"),
            "balance": Decimal("500.00"),
        }

        # Mock recent transactions
        mock_repo.get_by_user.return_value = [
            Transaction(
                id=uuid.uuid4(),
                user_id=user_id,
                amount=Decimal("100"),
                type="expense",
                description="Groceries",
                transaction_date=date(2024, 1, 15),
            ),
        ]

        # Mock category breakdowns
        mock_repo.get_category_breakdown.return_value = [
            {"category_name": "Food", "category_color": "#FF5733", "total": Decimal("300")},
        ]

        result = await service.get_dashboard(user_id)

        assert "balance" in result
        assert "income" in result
        assert "expense" in result
        assert "recent_transactions" in result
        assert "expense_by_category" in result
        assert "income_by_category" in result

        assert result["balance"] == "500.00"
        assert result["income"] == "1000.00"
        assert result["expense"] == "500.00"

    @pytest.mark.asyncio
    async def test_get_dashboard_with_date_range(self, service, mock_repo):
        """get_dashboard uses date range when provided."""
        user_id = uuid.uuid4()
        start_date = date(2024, 1, 1)
        end_date = date(2024, 1, 31)

        mock_repo.get_user_balance.return_value = {
            "income": Decimal("0"),
            "expense": Decimal("0"),
            "balance": Decimal("0"),
        }
        mock_repo.get_by_user.return_value = []
        mock_repo.get_category_breakdown.return_value = []

        await service.get_dashboard(user_id, start_date=start_date, end_date=end_date)

        # Verify date range was passed to balance query
        call_kwargs = mock_repo.get_user_balance.call_args.kwargs
        assert call_kwargs["start_date"] == start_date
        assert call_kwargs["end_date"] == end_date

    @pytest.mark.asyncio
    async def test_get_dashboard_returns_strings_for_amounts(self, service, mock_repo):
        """get_dashboard returns amounts as strings to avoid float precision issues."""
        user_id = uuid.uuid4()

        mock_repo.get_user_balance.return_value = {
            "income": Decimal("1000.50"),
            "expense": Decimal("500.25"),
            "balance": Decimal("500.25"),
        }
        mock_repo.get_by_user.return_value = []
        mock_repo.get_category_breakdown.return_value = []

        result = await service.get_dashboard(user_id)

        # Verify amounts are returned as strings
        assert isinstance(result["balance"], str)
        assert isinstance(result["income"], str)
        assert isinstance(result["expense"], str)
        assert result["balance"] == "500.25"
