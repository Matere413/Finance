from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession

from src.shared.database import get_db
from src.shared.dependencies import get_current_user, oauth2_scheme
from src.features.auth.model import User
from src.features.auth.repository import RefreshTokenRepository, UserRepository
from src.features.auth.service import AuthService
from src.features.auth.schemas import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter(prefix="/auth", tags=["auth"])


def get_auth_service(db: AsyncSession = Depends(get_db)) -> AuthService:
    return AuthService(UserRepository(db), RefreshTokenRepository(db))


# ---------------------------------------------------------------------------
# POST /auth/register
# ---------------------------------------------------------------------------


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    service: AuthService = Depends(get_auth_service),
):
    return await service.register(payload.email, payload.password)


# ---------------------------------------------------------------------------
# POST /auth/login
# ---------------------------------------------------------------------------


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    response: Response,
    service: AuthService = Depends(get_auth_service),
):
    access_token, raw_refresh = await service.login(payload.email, payload.password)
    response.set_cookie(
        key="refresh_token",
        value=raw_refresh,
        httponly=True,
        samesite="strict",
        secure=False,
        max_age=86400,
        path="/auth",
    )
    return TokenResponse(access_token=access_token)


# ---------------------------------------------------------------------------
# POST /auth/logout
# ---------------------------------------------------------------------------


@router.post("/logout")
async def logout(
    request: Request,
    response: Response,
    token: str = Depends(oauth2_scheme),
    current_user: User = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
):
    raw_refresh = request.cookies.get("refresh_token")
    await service.logout(access_token=token, raw_refresh_token=raw_refresh)
    response.delete_cookie("refresh_token", path="/auth")
    return {"message": "logged out"}


# ---------------------------------------------------------------------------
# POST /auth/refresh
# ---------------------------------------------------------------------------


@router.post("/refresh")
async def refresh(
    refresh_token: str | None = Cookie(default=None),
    service: AuthService = Depends(get_auth_service),
):
    if not refresh_token:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Missing refresh token"},
        )
    try:
        access_token, new_raw_refresh = await service.refresh(refresh_token)
    except HTTPException as exc:
        # Clear the cookie and return the error response
        error_response = JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )
        error_response.delete_cookie("refresh_token", path="/auth")
        return error_response
    resp = JSONResponse(
        status_code=status.HTTP_200_OK,
        content={"access_token": access_token, "token_type": "bearer"},
    )
    resp.set_cookie(
        key="refresh_token",
        value=new_raw_refresh,
        httponly=True,
        samesite="strict",
        secure=False,
        max_age=86400,
        path="/auth",
    )
    return resp


# ---------------------------------------------------------------------------
# GET /auth/me
# ---------------------------------------------------------------------------


@router.get("/me", response_model=UserResponse)
async def me(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
