import uuid
from datetime import datetime
from pydantic import BaseModel


class GroupBase(BaseModel):
    name: str
    description: str | None = None


class GroupCreate(GroupBase):
    pass


class GroupUpdate(BaseModel):
    name: str | None = None
    description: str | None = None


class GroupResponse(GroupBase):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    created_by: uuid.UUID
    created_at: datetime
    updated_at: datetime


class GroupMembershipResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    group_id: uuid.UUID
    user_id: uuid.UUID
    role: str
    joined_at: datetime


class GroupWithMembersResponse(GroupResponse):
    members: list[dict] = []


class AddMemberRequest(BaseModel):
    user_id: uuid.UUID
    role: str = "member"

    @staticmethod
    def validate_role(role: str) -> str:
        if role not in ("admin", "member"):
            raise ValueError("Role must be 'admin' or 'member'")
        return role
