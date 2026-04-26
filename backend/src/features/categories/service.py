import uuid
from fastapi import HTTPException, status
from src.features.categories.model import Category
from src.features.categories.repository import CategoryRepository
from src.features.categories.schemas import CategoryCreate, CategoryUpdate


class CategoryService:
    def __init__(self, category_repo: CategoryRepository):
        self.category_repo = category_repo

    async def create(self, user_id: uuid.UUID, data: CategoryCreate) -> Category:
        """Create a new category for a user."""
        # Check for duplicate category name+type combination
        existing = await self.category_repo.get_by_user(user_id)
        for cat in existing:
            if cat.name.lower() == data.name.lower() and cat.type == data.type:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail="Category with this name and type already exists"
                )

        category = Category(
            user_id=user_id,
            name=data.name,
            type=data.type,
            icon=data.icon,
            color=data.color,
            is_default=False,
        )
        return await self.category_repo.save(category)

    async def get_by_id(self, category_id: uuid.UUID, user_id: uuid.UUID) -> Category:
        """Get a category by ID, verifying ownership."""
        category = await self.category_repo.get_by_id(category_id)
        if not category or category.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found"
            )
        return category

    async def get_by_user(self, user_id: uuid.UUID) -> list[Category]:
        """Get all categories for a user."""
        return await self.category_repo.get_by_user(user_id)

    async def get_by_user_and_type(self, user_id: uuid.UUID, category_type: str) -> list[Category]:
        """Get categories filtered by type."""
        return await self.category_repo.get_by_user_and_type(user_id, category_type)

    async def update(self, category_id: uuid.UUID, user_id: uuid.UUID, data: CategoryUpdate) -> Category:
        """Update a category."""
        category = await self.get_by_id(category_id, user_id)

        # Don't allow updating default categories' name or type
        if category.is_default and (data.name is not None or data.is_default is not None):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot modify default categories"
            )

        if data.name is not None:
            category.name = data.name
        if data.icon is not None:
            category.icon = data.icon
        if data.color is not None:
            category.color = data.color
        if data.is_default is not None:
            category.is_default = data.is_default

        return await self.category_repo.update(category)

    async def delete(self, category_id: uuid.UUID, user_id: uuid.UUID) -> None:
        """Delete a category."""
        category = await self.get_by_id(category_id, user_id)

        if category.is_default:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot delete default categories"
            )

        await self.category_repo.delete(category_id)
