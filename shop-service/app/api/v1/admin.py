import httpx
import asyncio
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.schemas.admin import AdminLogin, Token
from app.schemas.order import OrderListResponse, OrderDetailResponse, OrderResponse, OrderResponse, UserInfo
from app.services.admin_service import AdminService
from app.services.order_service import OrderService
from app.core.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])


async def _fetch_user_info(user_id: int) -> dict | None:
    """从 user-service 获取用户信息"""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{settings.USER_SERVICE_URL}/api/v1/user/detail",
                params={"user_id": user_id}
            )
            if response.status_code == 200:
                return response.json()
            return None
    except Exception:
        return None


async def _enrich_order_with_user_info(order_response: OrderResponse) -> OrderResponse:
    """为单个订单填充用户信息"""
    user_info = await _fetch_user_info(order_response.user_id)
    if user_info:
        order_response.user_info = UserInfo(**user_info)
    return order_response


async def _enrich_orders_with_user_info(orders: list) -> list[OrderResponse]:
    """为订单列表填充用户信息"""
    # 先将 Order 对象转换为 OrderResponse
    order_responses = [OrderResponse.model_validate(order) for order in orders]

    # 收集所有唯一的 user_id
    user_ids = list(set(order.user_id for order in orders))

    # 并发获取用户信息
    user_info_map = {}
    if user_ids:
        async with httpx.AsyncClient(timeout=5.0) as client:
            tasks = []
            for user_id in user_ids:
                task = client.get(
                    f"{settings.USER_SERVICE_URL}/api/v1/user/detail",
                    params={"user_id": user_id}
                )
                tasks.append(task)

            responses = await asyncio.gather(*tasks, return_exceptions=True)

            for user_id, response in zip(user_ids, responses):
                if not isinstance(response, Exception) and response.status_code == 200:
                    user_info_map[user_id] = response.json()

    # 填充用户信息
    for order_resp in order_responses:
        if order_resp.user_id in user_info_map:
            order_resp.user_info = UserInfo(**user_info_map[order_resp.user_id])

    return order_responses


@router.post("/auth/login", response_model=Token)
def login(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    """管理员登录"""
    return AdminService.login(db, login_data)


@router.get("/order/list")
async def get_order_list(
    status: str | None = Query(None, description="订单状态筛选"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取订单列表"""
    orders = OrderService.admin_get_order_list(db, status)
    enriched_orders = await _enrich_orders_with_user_info(orders)
    return OrderListResponse(items=enriched_orders)


@router.get("/order/detail", response_model=OrderDetailResponse)
async def get_order_detail(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取订单详情"""
    order = OrderService.admin_get_order_detail_with_items(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在"
        )
    # 填充用户信息
    enriched_order = await _enrich_order_with_user_info(order)
    return enriched_order


@router.post("/order/ship", response_model=OrderResponse)
async def ship_order(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """发货"""
    order = OrderService.admin_ship_order(db, order_id)
    # 填充用户信息
    enriched_order = await _enrich_order_with_user_info(order)
    return enriched_order
