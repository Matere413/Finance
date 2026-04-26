"""
T-027: Failing unit tests for CategoryService.
"""
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock


class TestCategoryService:
    """Unit tests for CategoryService with mocked repository."""

    @pytest.fixture
    def mock_repo(self):
        """Create a mock CategoryRepository."""
        repo = MagicMock()
        repo.save = AsyncMock()
        repo.get_by_id = AsyncMock()
        repo.get_by_user = AsyncMock()
        repo.get_by_user_and_type = AsyncMock()
        repo.update = AsyncMock()
        repo.delete = AsyncMock()
        return repo

    @pytest.fixture
    def service(self, mock_repo):
        """Create a CategoryService with mocked repository."""
        from src.features.categories.service import CategoryService
        return CategoryService(mock_repo)

    @pytest.mark.asyncio
    async def test_create_category_success(self, service, mock_repo):
        """Creating a category with valid data succeeds."""
        from src.features.categories.schemas import CategoryCreate
        from src.features.categories.model import Category

        user_id = uuid.uuid4()
        data = CategoryCreate(name="Food", type="expense", icon="utensils", color="#FF5733")

        mock_repo.get_by_user.return_value = []
        mock_repo.save.return_value = Category(
            id=uuid.uuid4(),
            user_id=user_id,
            name="Food",
            type="expense",
            icon="utensils",
            color="#FF5733",
            is_default=False,
        )

        result = await service.create(user_id, data)

        assert result.name == "Food"
        assert result.type == "expense"
        mock_repo.save.assert_called_once()

    @pytest.mark.asyncio
    async def test_create_category_duplicate_name_type(self, service, mock_repo):
        """Creating a category with duplicate name+type raises exception."""
        from src.features.categories.schemas import CategoryCreate
        from src.features.categories.model import Category
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        data = CategoryCreate(name="Food", type="expense")

        existing = Category(
            id=uuid.uuid4(),
            user_id=user_id,
            name="Food",
            type="expense",
            is_default=False,
        )
        mock_repo.get_by_user.return_value = [existing]

        with pytest.raises(HTTPException) as exc_info:
            await service.create(user_id, data)

        assert exc_info.value.status_code == 409

    @pytest.mark.asyncio
    async def test_get_by_id_success(self, service, mock_repo):
        """Getting a category by ID returns the category if owned by user."""
        from src.features.categories.model import Category

        user_id = uuid.uuid4()
        category_id = uuid.uuid4()
        category = Category(
            id=category_id,
            user_id=user_id,
            name="Food",
            type="expense",
            is_default=False,
        )
        mock_repo.get_by_id.return_value = category

        result = await service.get_by_id(category_id, user_id)

        assert result.id == category_id
        assert result.user_id == user_id

    @pytest.mark.asyncio
    async def test_get_by_id_not_found(self, service, mock_repo):
        """Getting a non-existent category raises 404."""
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        category_id = uuid.uuid4()
        mock_repo.get_by_id.return_value = None

        with pytest.raises(HTTPException) as exc_info:
            await service.get_by_id(category_id, user_id)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_get_by_id_wrong_user(self, service, mock_repo):
        """Getting a category owned by another user raises 404."""
        from src.features.categories.model import Category
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        other_user_id = uuid.uuid4()
        category_id = uuid.uuid4()
        category = Category(
            id=category_id,
            user_id=other_user_id,
            name="Food",
            type="expense",
            is_default=False,
        )
        mock_repo.get_by_id.return_value = category

        with pytest.raises(HTTPException) as exc_info:
            await service.get_by_id(category_id, user_id)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_update_default_category_fails(self, service, mock_repo):
        """Updating a default category's name raises 403."""
        from src.features.categories.model import Category
        from src.features.categories.schemas import CategoryUpdate
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        category_id = uuid.uuid4()
        category = Category(
            id=category_id,
            user_id=user_id,
            name="Food",
            type="expense",
            is_default=True,
        )
        mock_repo.get_by_id.return_value = category

        data = CategoryUpdate(name="Groceries")

        with pytest.raises(HTTPException) as exc_info:
            await service.update(category_id, user_id, data)

        assert exc_info.value.status_code == 403

    @pytest.mark.asyncio
    async def test_delete_default_category_fails(self, service, mock_repo):
        """Deleting a default category raises 403."""
        from src.features.categories.model import Category
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        category_id = uuid.uuid4()
        category = Category(
            id=category_id,
            user_id=user_id,
            name="Food",
            type="expense",
            is_default=True,
        )
        mock_repo.get_by_id.return_value = category

        with pytest.raises(HTTPException) as exc_info:
            await service.delete(category_id, user_id)

        assert exc_info.value.status_code == 403
