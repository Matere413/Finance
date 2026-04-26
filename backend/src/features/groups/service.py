import uuid
from fastapi import HTTPException, status
from src.features.groups.model import Group, GroupMembership
from src.features.groups.repository import GroupRepository, MembershipRepository
from src.features.groups.schemas import GroupCreate, GroupUpdate, AddMemberRequest


class GroupService:
    def __init__(self, group_repo: GroupRepository, membership_repo: MembershipRepository):
        self.group_repo = group_repo
        self.membership_repo = membership_repo

    async def create(self, user_id: uuid.UUID, data: GroupCreate) -> Group:
        """Create a new group and add creator as admin."""
        group = Group(
            name=data.name,
            description=data.description,
            created_by=user_id,
        )
        saved_group = await self.group_repo.save(group)

        # Add creator as admin
        membership = GroupMembership(
            group_id=saved_group.id,
            user_id=user_id,
            role="admin",
        )
        await self.membership_repo.save(membership)

        return saved_group

    async def get_by_id(self, group_id: uuid.UUID, user_id: uuid.UUID) -> Group:
        """Get a group by ID, verifying membership."""
        # Check if user is a member
        if not await self.membership_repo.is_member(user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found or you are not a member"
            )

        group = await self.group_repo.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )
        return group

    async def get_by_user(self, user_id: uuid.UUID) -> list[Group]:
        """Get all groups that a user is a member of."""
        return await self.group_repo.get_by_user(user_id)

    async def update(
        self, group_id: uuid.UUID, user_id: uuid.UUID, data: GroupUpdate
    ) -> Group:
        """Update a group. Only admins can update."""
        # Check if user is an admin
        if not await self.membership_repo.is_admin(user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only group admins can update the group"
            )

        group = await self.group_repo.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        if data.name is not None:
            group.name = data.name
        if data.description is not None:
            group.description = data.description

        return await self.group_repo.update(group)

    async def delete(self, group_id: uuid.UUID, user_id: uuid.UUID) -> None:
        """Delete a group. Only the creator or admins can delete."""
        group = await self.group_repo.get_by_id(group_id)
        if not group:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found"
            )

        # Check if user is creator or admin
        if group.created_by != user_id and not await self.membership_repo.is_admin(user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only group creator or admins can delete the group"
            )

        await self.group_repo.delete(group_id)

    async def add_member(
        self, group_id: uuid.UUID, user_id: uuid.UUID, data: AddMemberRequest
    ) -> GroupMembership:
        """Add a member to a group. Only admins can add members."""
        # Check if user is an admin
        if not await self.membership_repo.is_admin(user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only group admins can add members"
            )

        # Check if target user is already a member
        if await self.membership_repo.is_member(data.user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User is already a member of this group"
            )

        membership = GroupMembership(
            group_id=group_id,
            user_id=data.user_id,
            role=data.role,
        )
        return await self.membership_repo.save(membership)

    async def remove_member(
        self, group_id: uuid.UUID, member_id: uuid.UUID, user_id: uuid.UUID
    ) -> None:
        """Remove a member from a group. Admins can remove anyone, members can remove themselves."""
        # Check permissions
        is_admin = await self.membership_repo.is_admin(user_id, group_id)
        is_self = user_id == member_id

        if not is_admin and not is_self:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only remove yourself or be removed by an admin"
            )

        # Can't remove the creator
        group = await self.group_repo.get_by_id(group_id)
        if group and group.created_by == member_id and not is_self:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Cannot remove the group creator"
            )

        membership = await self.membership_repo.get_by_user_and_group(member_id, group_id)
        if not membership:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Membership not found"
            )

        await self.membership_repo.delete(membership.id)

    async def get_members(self, group_id: uuid.UUID, user_id: uuid.UUID) -> list[GroupMembership]:
        """Get all members of a group."""
        # Check if user is a member
        if not await self.membership_repo.is_member(user_id, group_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Group not found or you are not a member"
            )

        return await self.membership_repo.get_by_group(group_id)
