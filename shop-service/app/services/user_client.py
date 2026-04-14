import httpx
from typing import Optional

from app.config import settings


class UserServiceClient:
    """用户服务客户端，用于调用 user-service 的接口"""

    def __init__(self):
        self.base_url = settings.USER_SERVICE_URL

    async def verify_user_exists(self, user_id: int) -> bool:
        """校验用户是否存在"""
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/user/exist",
                    params={"user_id": user_id}
                )
                if response.status_code == 200:
                    return response.json().get("exists", False)
                return False
        except Exception:
            # 调用失败时暂时返回 True（后续完善降级策略）
            return True


user_client = UserServiceClient()
