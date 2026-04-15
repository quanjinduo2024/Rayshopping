from fastapi import APIRouter, Depends, Query
from app.core.deps import get_current_admin
from app.services.order_service import OrderService

router = APIRouter(prefix="/order", tags=["order"])


@router.get("/list")
async def get_order_list(
    status: str | None = Query(None, description="订单状态筛选"),
    current_admin_id: int = Depends(get_current_admin),
):
    """获取订单列表"""
    return await OrderService.get_order_list(status)


@router.get("/detail")
async def get_order_detail(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
):
    """获取订单详情"""
    return await OrderService.get_order_detail(order_id)


@router.post("/ship")
async def ship_order(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
):
    """发货"""
    return await OrderService.ship_order(order_id)
