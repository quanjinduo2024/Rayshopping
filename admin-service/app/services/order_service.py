"""
订单管理服务 - 通过 HTTP 调用 shop-service
"""
import httpx
from fastapi import HTTPException, status

from app.config import settings


class OrderService:
    @staticmethod
    async def get_order_list(status: str | None = None):
        """获取订单列表"""
        params = {}
        if status:
            params["status"] = status

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.SHOP_SERVICE_URL}/api/v1/order/admin/list",
                    params=params
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"调用 shop-service 失败: {str(e)}"
            )

    @staticmethod
    async def get_order_detail(order_id: int):
        """获取订单详情"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{settings.SHOP_SERVICE_URL}/api/v1/order/admin/detail",
                    params={"order_id": order_id}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="订单不存在"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"调用 shop-service 失败: {str(e)}"
            )
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"调用 shop-service 失败: {str(e)}"
            )

    @staticmethod
    async def ship_order(order_id: int):
        """发货"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{settings.SHOP_SERVICE_URL}/api/v1/order/admin/ship",
                    params={"order_id": order_id}
                )
                response.raise_for_status()
                return response.json()
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="订单不存在"
                )
            if e.response.status_code == 400:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="订单状态不允许发货"
                )
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"调用 shop-service 失败: {str(e)}"
            )
        except httpx.HTTPError as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"调用 shop-service 失败: {str(e)}"
            )
