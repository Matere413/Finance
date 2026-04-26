import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from src.features.categories.model import Category


class CategoryRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, category_id: uuid.UUID) -> Category | None:
        result = await self.session.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(self, user_id: uuid.UUID) -> list[Category]:
        result = await self.session.execute(
            select(Category).where(Category.user_id == user_id)
        )
        return result.scalars().all()

    async def get_by_user_and_type(self, user_id: uuid.UUID, category_type: str) -> list[Category]:
        result = await self.session.execute(
            select(Category).where(
                Category.user_id == user_id,
                Category.type == category_type
            )
        )
        return result.scalars().all()

    async def save(self, category: Category) -> Category:
        self.session.add(category)
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def update(self, category: Category) -> Category:
        await self.session.commit()
        await self.session.refresh(category)
        return category

    async def delete(self, category_id: uuid.UUID) -> None:
        result = await self.session.execute(
            select(Category).where(Category.id == category_id)
        )
        category = result.scalar_one_or_none()
        if category:
            await self.session.delete(category)
            await self.session.commit()

    async def get_default_categories(self, user_id: uuid.UUID) -> list[Category]:
        result = await self.session.execute(
            select(Category).where(
                Category.user_id == user_id,
                Category.is_default == True  # noqa: E712
            )
        )
        return result.scalars().all()
