import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.database import get_db
from src.shared.dependencies import get_current_user
from src.features.auth.model import User
from src.features.categories.repository import CategoryRepository
from src.features.categories.service import CategoryService
from src.features.categories.schemas import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["categories"])


def get_category_service(db: AsyncSession = Depends(get_db)) -> CategoryService:
    return CategoryService(CategoryRepository(db))


@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    payload: CategoryCreate,
    current_user: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    """Create a new category."""
    return await service.create(current_user.id, payload)


@router.get("", response_model=list[CategoryResponse])
async def list_categories(
    category_type: str | None = None,
    current_user: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    """List all categories for the current user, optionally filtered by type."""
    if category_type:
        return await service.get_by_user_and_type(current_user.id, category_type)
    return await service.get_by_user(current_user.id)


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(
    category_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    """Get a specific category by ID."""
    return await service.get_by_id(category_id, current_user.id)


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: uuid.UUID,
    payload: CategoryUpdate,
    current_user: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    """Update a category."""
    return await service.update(category_id, current_user.id, payload)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: CategoryService = Depends(get_category_service),
):
    """Delete a category."""
    await service.delete(category_id, current_user.id)
    return None
