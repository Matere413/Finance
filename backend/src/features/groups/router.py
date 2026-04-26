import uuid
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.database import get_db
from src.shared.dependencies import get_current_user
from src.features.auth.model import User
from src.features.groups.repository import GroupRepository, MembershipRepository
from src.features.groups.service import GroupService
from src.features.groups.schemas import (
    GroupCreate,
    GroupUpdate,
    GroupResponse,
    GroupWithMembersResponse,
    GroupMembershipResponse,
    AddMemberRequest,
)

router = APIRouter(prefix="/groups", tags=["groups"])


def get_group_service(db: AsyncSession = Depends(get_db)) -> GroupService:
    return GroupService(GroupRepository(db), MembershipRepository(db))


@router.post("", response_model=GroupResponse, status_code=status.HTTP_201_CREATED)
async def create_group(
    payload: GroupCreate,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Create a new group."""
    return await service.create(current_user.id, payload)


@router.get("", response_model=list[GroupResponse])
async def list_groups(
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """List all groups the current user is a member of."""
    return await service.get_by_user(current_user.id)


@router.get("/{group_id}", response_model=GroupWithMembersResponse)
async def get_group(
    group_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Get a specific group by ID with members."""
    group = await service.get_by_id(group_id, current_user.id)
    members = await service.get_members(group_id, current_user.id)
    return GroupWithMembersResponse(
        id=group.id,
        name=group.name,
        description=group.description,
        created_by=group.created_by,
        created_at=group.created_at,
        updated_at=group.updated_at,
        members=[
            {
                "id": str(m.id),
                "user_id": str(m.user_id),
                "role": m.role,
                "joined_at": m.joined_at.isoformat(),
            }
            for m in members
        ]
    )


@router.put("/{group_id}", response_model=GroupResponse)
async def update_group(
    group_id: uuid.UUID,
    payload: GroupUpdate,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Update a group."""
    return await service.update(group_id, current_user.id, payload)


@router.delete("/{group_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_group(
    group_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Delete a group."""
    await service.delete(group_id, current_user.id)
    return None


@router.post("/{group_id}/members", response_model=GroupMembershipResponse, status_code=status.HTTP_201_CREATED)
async def add_member(
    group_id: uuid.UUID,
    payload: AddMemberRequest,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Add a member to a group."""
    return await service.add_member(group_id, current_user.id, payload)


@router.get("/{group_id}/members", response_model=list[GroupMembershipResponse])
async def list_members(
    group_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """List all members of a group."""
    members = await service.get_members(group_id, current_user.id)
    return [
        GroupMembershipResponse(
            id=m.id,
            group_id=m.group_id,
            user_id=m.user_id,
            role=m.role,
            joined_at=m.joined_at,
        )
        for m in members
    ]


@router.delete("/{group_id}/members/{member_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    group_id: uuid.UUID,
    member_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    service: GroupService = Depends(get_group_service),
):
    """Remove a member from a group."""
    await service.remove_member(group_id, member_id, current_user.id)
    return None
