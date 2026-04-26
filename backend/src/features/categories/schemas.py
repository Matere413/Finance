import uuid
from datetime import datetime
from pydantic import BaseModel, field_validator


class CategoryBase(BaseModel):
    name: str
    type: str  # income or expense
    icon: str | None = None
    color: str | None = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("income", "expense"):
            raise ValueError("Type must be 'income' or 'expense'")
        return v

    @field_validator("color")
    @classmethod
    def validate_color(cls, v: str | None) -> str | None:
        if v and not v.startswith("#"):
            raise ValueError("Color must be a hex code starting with #")
        return v


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: str | None = None
    icon: str | None = None
    color: str | None = None
    is_default: bool | None = None


class CategoryResponse(CategoryBase):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    user_id: uuid.UUID
    is_default: bool
    created_at: datetime
    updated_at: datetime
