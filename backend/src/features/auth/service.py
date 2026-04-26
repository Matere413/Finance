import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from src.features.auth.model import RefreshToken, User
from src.features.auth.repository import RefreshTokenRepository, UserRepository
from src.features.auth.schemas import UserResponse
from src.shared.config import settings
from src.shared.exceptions import CredentialsException, UserAlreadyExistsException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, user_repo: UserRepository, token_repo: RefreshTokenRepository):
        self.user_repo = user_repo
        self.token_repo = token_repo

    # ------------------------------------------------------------------
    # T-020: register
    # ------------------------------------------------------------------

    async def register(self, email: str, password: str) -> UserResponse:
        existing = await self.user_repo.get_by_email(email.lower())
        if existing:
            raise UserAlreadyExistsException
        user = User(
            email=email.lower(),
            hashed_password=pwd_context.hash(password),
            role="user",
        )
        saved = await self.user_repo.save(user)
        return UserResponse.model_validate(saved)

    # ------------------------------------------------------------------
    # T-022: login helpers + login
    # ------------------------------------------------------------------

    def _create_access_token(self, user_id: uuid.UUID) -> str:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
        return jwt.encode(
            {"sub": str(user_id), "exp": expire},
            settings.SECRET_KEY,
            algorithm="HS256",
        )

    async def login(self, email: str, password: str):
        user = await self.user_repo.get_by_email(email.lower())
        if not user or not pwd_context.verify(password, user.hashed_password):
            raise CredentialsException
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Inactive user",
            )
        access_token = self._create_access_token(user.id)
        raw_refresh = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_refresh.encode()).hexdigest()
        refresh_token = RefreshToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        await self.token_repo.save(refresh_token)
        return access_token, raw_refresh

    # ------------------------------------------------------------------
    # T-024: logout
    # ------------------------------------------------------------------

    async def logout(self, access_token: str) -> None:
        try:
            payload = jwt.decode(
                access_token, settings.SECRET_KEY, algorithms=["HS256"]
            )
            user_id = uuid.UUID(payload["sub"])
        except (JWTError, KeyError, ValueError):
            raise CredentialsException
        await self.token_repo.revoke_all_for_user(user_id)

    # ------------------------------------------------------------------
    # T-026: refresh (token rotation)
    # ------------------------------------------------------------------

    async def refresh(self, raw_refresh_token: str):
        token_hash = hashlib.sha256(raw_refresh_token.encode()).hexdigest()
        stored = await self.token_repo.get_by_hash(token_hash)
        if not stored or stored.revoked:
            raise CredentialsException
        # Normalize expires_at to UTC-aware for comparison
        expires_at = stored.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise CredentialsException
        user = await self.user_repo.get_by_id(stored.user_id)
        if not user:
            raise CredentialsException
        await self.token_repo.revoke_all_for_user(user.id)
        new_raw = secrets.token_urlsafe(32)
        new_hash = hashlib.sha256(new_raw.encode()).hexdigest()
        new_token = RefreshToken(
            user_id=user.id,
            token_hash=new_hash,
            expires_at=datetime.now(timezone.utc)
            + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
        )
        await self.token_repo.save(new_token)
        return self._create_access_token(user.id), new_raw
