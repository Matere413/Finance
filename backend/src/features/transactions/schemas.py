import uuid
from datetime import date as DateType, datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, field_validator


class TransactionBase(BaseModel):
    amount: Decimal
    type: str  # income or expense
    description: Optional[str] = None
    date: DateType
    category_id: Optional[uuid.UUID] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        if v not in ("income", "expense"):
            raise ValueError("Type must be 'income' or 'expense'")
        return v

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Decimal) -> Decimal:
        if v <= 0:
            raise ValueError("Amount must be positive")
        return v


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    amount: Optional[Decimal] = None
    type: Optional[str] = None
    description: Optional[str] = None
    date: Optional[DateType] = None
    category_id: Optional[uuid.UUID] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ("income", "expense"):
            raise ValueError("Type must be 'income' or 'expense'")
        return v

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: Optional[Decimal]) -> Optional[Decimal]:
        if v is not None and v <= 0:
            raise ValueError("Amount must be positive")
        return v


class TransactionResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    user_id: uuid.UUID
    category_id: Optional[uuid.UUID]
    amount: str  # Return as string to avoid float precision issues
    type: str
    description: Optional[str]
    date: DateType
    created_at: datetime
    updated_at: datetime


class TransactionListResponse(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    amount: str
    type: str
    description: Optional[str]
    date: DateType
    category_name: Optional[str]
    category_color: Optional[str]
