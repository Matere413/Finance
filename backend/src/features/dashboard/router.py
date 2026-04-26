import uuid
from datetime import date
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.database import get_db
from src.shared.dependencies import get_current_user
from src.features.auth.model import User
from src.features.transactions.repository import TransactionRepository
from src.features.dashboard.service import DashboardService
from pydantic import BaseModel
from decimal import Decimal

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def get_dashboard_service(db: AsyncSession = Depends(get_db)) -> DashboardService:
    return DashboardService(TransactionRepository(db))


class DashboardResponse(BaseModel):
    balance: str
    income: str
    expense: str
    recent_transactions: list[dict]
    expense_by_category: list[dict]
    income_by_category: list[dict]


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    start_date: date | None = None,
    end_date: date | None = None,
    current_user: User = Depends(get_current_user),
    service: DashboardService = Depends(get_dashboard_service),
):
    """Get dashboard data for the current user."""
    dashboard_data = await service.get_dashboard(
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date
    )
    return DashboardResponse(**dashboard_data)
