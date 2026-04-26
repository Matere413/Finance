import uuid
from datetime import date
from decimal import Decimal
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from src.shared.database import get_db
from src.shared.dependencies import get_current_user
from src.features.auth.model import User
from src.features.transactions.repository import TransactionRepository
from src.features.transactions.service import TransactionService
from src.features.transactions.schemas import (
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    TransactionListResponse,
)

router = APIRouter(prefix="/transactions", tags=["transactions"])


def get_transaction_service(db: AsyncSession = Depends(get_db)) -> TransactionService:
    return TransactionService(TransactionRepository(db))


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    """Create a new transaction."""
    return await service.create(current_user.id, payload)


@router.get("", response_model=list[TransactionListResponse])
async def list_transactions(
    start_date: date | None = None,
    end_date: date | None = None,
    transaction_type: str | None = None,
    category_id: uuid.UUID | None = None,
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    """List all transactions for the current user with optional filters."""
    transactions = await service.get_by_user(
        user_id=current_user.id,
        start_date=start_date,
        end_date=end_date,
        transaction_type=transaction_type,
        category_id=category_id,
        limit=limit,
        offset=offset,
    )
    # Convert transactions to response format with category info
    response = []
    for t in transactions:
        response.append(TransactionListResponse(
            id=t.id,
            amount=str(t.amount),
            type=t.type,
            description=t.description,
            date=t.transaction_date,
            category_name=None,  # Will be populated via join in future
            category_color=None,
        ))
    return response


@router.get("/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    """Get a specific transaction by ID."""
    return await service.get_by_id(transaction_id, current_user.id)


@router.put("/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: uuid.UUID,
    payload: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    """Update a transaction."""
    return await service.update(transaction_id, current_user.id, payload)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: TransactionService = Depends(get_transaction_service),
):
    """Delete a transaction."""
    await service.delete(transaction_id, current_user.id)
    return None
