"""
T-044: Failing unit tests for GroupService.
"""
import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock


class TestGroupService:
    """Unit tests for GroupService with mocked repositories."""

    @pytest.fixture
    def mock_group_repo(self):
        """Create a mock GroupRepository."""
        repo = MagicMock()
        repo.save = AsyncMock()
        repo.get_by_id = AsyncMock()
        repo.get_by_user = AsyncMock()
        repo.update = AsyncMock()
        repo.delete = AsyncMock()
        return repo

    @pytest.fixture
    def mock_membership_repo(self):
        """Create a mock MembershipRepository."""
        repo = MagicMock()
        repo.save = AsyncMock()
        repo.get_by_id = AsyncMock()
        repo.get_by_group = AsyncMock()
        repo.get_by_user_and_group = AsyncMock()
        repo.delete = AsyncMock()
        repo.is_member = AsyncMock()
        repo.is_admin = AsyncMock()
        return repo

    @pytest.fixture
    def service(self, mock_group_repo, mock_membership_repo):
        """Create a GroupService with mocked repositories."""
        from src.features.groups.service import GroupService
        return GroupService(mock_group_repo, mock_membership_repo)

    @pytest.mark.asyncio
    async def test_create_group_success(self, service, mock_group_repo, mock_membership_repo):
        """Creating a group succeeds and creator is added as admin."""
        from src.features.groups.schemas import GroupCreate
        from src.features.groups.model import Group, GroupMembership

        user_id = uuid.uuid4()
        data = GroupCreate(name="Test Group", description="Test description")

        group_id = uuid.uuid4()
        mock_group_repo.save.return_value = Group(
            id=group_id,
            name="Test Group",
            description="Test description",
            created_by=user_id,
        )
        mock_membership_repo.save.return_value = GroupMembership(
            id=uuid.uuid4(),
            group_id=group_id,
            user_id=user_id,
            role="admin",
        )

        result = await service.create(user_id, data)

        assert result.name == "Test Group"
        assert result.created_by == user_id
        mock_group_repo.save.assert_called_once()
        mock_membership_repo.save.assert_called_once()

    @pytest.mark.asyncio
    async def test_get_by_id_success(self, service, mock_group_repo, mock_membership_repo):
        """Getting a group by ID succeeds if user is a member."""
        from src.features.groups.model import Group

        user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        group = Group(
            id=group_id,
            name="Test Group",
            description="Test",
            created_by=user_id,
        )
        mock_membership_repo.is_member.return_value = True
        mock_group_repo.get_by_id.return_value = group

        result = await service.get_by_id(group_id, user_id)

        assert result.id == group_id
        mock_membership_repo.is_member.assert_called_once_with(user_id, group_id)

    @pytest.mark.asyncio
    async def test_get_by_id_not_member(self, service, mock_group_repo, mock_membership_repo):
        """Getting a group by ID raises 404 if user is not a member."""
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        mock_membership_repo.is_member.return_value = False

        with pytest.raises(HTTPException) as exc_info:
            await service.get_by_id(group_id, user_id)

        assert exc_info.value.status_code == 404

    @pytest.mark.asyncio
    async def test_update_not_admin(self, service, mock_group_repo, mock_membership_repo):
        """Updating a group raises 403 if user is not an admin."""
        from src.features.groups.schemas import GroupUpdate
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        mock_membership_repo.is_admin.return_value = False

        with pytest.raises(HTTPException) as exc_info:
            await service.update(group_id, user_id, GroupUpdate(name="New Name"))

        assert exc_info.value.status_code == 403

    @pytest.mark.asyncio
    async def test_delete_not_admin_or_creator(self, service, mock_group_repo, mock_membership_repo):
        """Deleting a group raises 403 if user is not admin or creator."""
        from src.features.groups.model import Group
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        other_user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        group = Group(
            id=group_id,
            name="Test Group",
            created_by=other_user_id,
        )
        mock_group_repo.get_by_id.return_value = group
        mock_membership_repo.is_admin.return_value = False

        with pytest.raises(HTTPException) as exc_info:
            await service.delete(group_id, user_id)

        assert exc_info.value.status_code == 403

    @pytest.mark.asyncio
    async def test_add_member_not_admin(self, service, mock_group_repo, mock_membership_repo):
        """Adding a member raises 403 if user is not an admin."""
        from src.features.groups.schemas import AddMemberRequest
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        mock_membership_repo.is_admin.return_value = False

        with pytest.raises(HTTPException) as exc_info:
            await service.add_member(group_id, user_id, AddMemberRequest(user_id=uuid.uuid4()))

        assert exc_info.value.status_code == 403

    @pytest.mark.asyncio
    async def test_add_member_already_member(self, service, mock_group_repo, mock_membership_repo):
        """Adding a member raises 409 if user is already a member."""
        from src.features.groups.schemas import AddMemberRequest
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        new_member_id = uuid.uuid4()
        group_id = uuid.uuid4()
        mock_membership_repo.is_admin.return_value = True
        mock_membership_repo.is_member.return_value = True

        with pytest.raises(HTTPException) as exc_info:
            await service.add_member(group_id, user_id, AddMemberRequest(user_id=new_member_id))

        assert exc_info.value.status_code == 409

    @pytest.mark.asyncio
    async def test_remove_member_permission_denied(self, service, mock_group_repo, mock_membership_repo):
        """Removing a member raises 403 if user is not admin and not removing self."""
        from src.features.groups.model import GroupMembership
        from fastapi import HTTPException

        user_id = uuid.uuid4()
        other_user_id = uuid.uuid4()
        group_id = uuid.uuid4()
        mock_membership_repo.is_admin.return_value = False
        mock_membership_repo.get_by_user_and_group.return_value = GroupMembership(
            id=uuid.uuid4(),
            group_id=group_id,
            user_id=other_user_id,
            role="member",
        )

        with pytest.raises(HTTPException) as exc_info:
            await service.remove_member(group_id, other_user_id, user_id)

        assert exc_info.value.status_code == 403
