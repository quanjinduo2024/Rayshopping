from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import decode_access_token

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    """
    获取当前登录用户 ID
    解析 JWT Token 获取 user_id，与 user-service 使用相同的密钥
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # 解码 JWT Token
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    user_id_str: str | None = payload.get("sub")
    if user_id_str is None:
        raise credentials_exception
    try:
        user_id = int(user_id_str)
    except (ValueError, TypeError):
        raise credentials_exception
    return user_id


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    """
    获取当前登录管理员 ID
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_access_token(credentials.credentials)
    if payload is None:
        raise credentials_exception
    admin_id_str: str | None = payload.get("sub")
    if admin_id_str is None:
        raise credentials_exception
    try:
        admin_id = int(admin_id_str)
    except (ValueError, TypeError):
        raise credentials_exception
    return admin_id
