from fastapi import HTTPException, status

CredentialsException = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    headers={"WWW-Authenticate": "Bearer"},
)

UserAlreadyExistsException = HTTPException(
    status_code=status.HTTP_409_CONFLICT,
    detail="Email already registered",
)

InactiveUserException = HTTPException(
    status_code=status.HTTP_403_FORBIDDEN,
    detail="Account is inactive",
)
