from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> int:
    """
    获取当前登录用户 ID
    注意：这里只是解析 token 获取 user_id，实际的用户校验在需要时调用 user-service
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无法验证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    # 简单地从 token 中提取 user_id（实际使用时需要与 user-service 使用相同的密钥解密）
    # 这里暂时只做格式验证，后续完善
    try:
        # 暂时使用简单的方式：假设 token 格式为 "user_<user_id>"
        token = credentials.credentials
        if token.startswith("user_"):
            user_id = int(token.split("_")[1])
            return user_id
    except Exception:
        pass
    raise credentials_exception
