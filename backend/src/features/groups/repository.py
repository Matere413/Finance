import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from src.features.groups.model import Group, GroupMembership


class GroupRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, group_id: uuid.UUID) -> Group | None:
        result = await self.session.execute(
            select(Group).where(Group.id == group_id)
        )
        return result.scalar_one_or_none()

    async def get_by_user(self, user_id: uuid.UUID) -> list[Group]:
        """Get all groups that a user is a member of."""
        result = await self.session.execute(
            select(Group)
            .join(GroupMembership, Group.id == GroupMembership.group_id)
            .where(GroupMembership.user_id == user_id)
        )
        return result.scalars().all()

    async def save(self, group: Group) -> Group:
        self.session.add(group)
        await self.session.commit()
        await self.session.refresh(group)
        return group

    async def update(self, group: Group) -> Group:
        await self.session.commit()
        await self.session.refresh(group)
        return group

    async def delete(self, group_id: uuid.UUID) -> None:
        result = await self.session.execute(
            select(Group).where(Group.id == group_id)
        )
        group = result.scalar_one_or_none()
        if group:
            await self.session.delete(group)
            await self.session.commit()


class MembershipRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_id(self, membership_id: uuid.UUID) -> GroupMembership | None:
        result = await self.session.execute(
            select(GroupMembership).where(GroupMembership.id == membership_id)
        )
        return result.scalar_one_or_none()

    async def get_by_group(self, group_id: uuid.UUID) -> list[GroupMembership]:
        result = await self.session.execute(
            select(GroupMembership).where(GroupMembership.group_id == group_id)
        )
        return result.scalars().all()

    async def get_by_user_and_group(
        self, user_id: uuid.UUID, group_id: uuid.UUID
    ) -> GroupMembership | None:
        result = await self.session.execute(
            select(GroupMembership).where(
                GroupMembership.user_id == user_id,
                GroupMembership.group_id == group_id
            )
        )
        return result.scalar_one_or_none()

    async def save(self, membership: GroupMembership) -> GroupMembership:
        self.session.add(membership)
        await self.session.commit()
        await self.session.refresh(membership)
        return membership

    async def delete(self, membership_id: uuid.UUID) -> None:
        result = await self.session.execute(
            select(GroupMembership).where(GroupMembership.id == membership_id)
        )
        membership = result.scalar_one_or_none()
        if membership:
            await self.session.delete(membership)
            await self.session.commit()

    async def is_member(self, user_id: uuid.UUID, group_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            select(GroupMembership).where(
                GroupMembership.user_id == user_id,
                GroupMembership.group_id == group_id
            )
        )
        return result.scalar_one_or_none() is not None

    async def is_admin(self, user_id: uuid.UUID, group_id: uuid.UUID) -> bool:
        result = await self.session.execute(
            select(GroupMembership).where(
                GroupMembership.user_id == user_id,
                GroupMembership.group_id == group_id,
                GroupMembership.role == "admin"
            )
        )
        return result.scalar_one_or_none() is not None
