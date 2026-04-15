from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.order import (
    OrderCheckout,
    OrderCartCheckout,
    OrderResponse,
    OrderListResponse,
    OrderDetailResponse,
)
from app.services.order_service import OrderService
from app.core.deps import get_current_user

router = APIRouter(prefix="/order", tags=["order"])


@router.post("/checkout", response_model=OrderResponse)
def checkout_direct(
    order_data: OrderCheckout,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """直接购买结算"""
    return OrderService.checkout_direct(db, current_user_id, order_data)


@router.post("/checkout/cart", response_model=OrderResponse)
def checkout_cart(
    order_data: OrderCartCheckout,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """购物车结算"""
    return OrderService.checkout_cart(db, current_user_id, order_data)


@router.get("/list", response_model=OrderListResponse)
def get_order_list(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取订单列表"""
    items = OrderService.get_order_list(db, current_user_id)
    return OrderListResponse(items=items)


@router.get("/detail", response_model=OrderDetailResponse)
def get_order_detail(
    order_id: int = Query(..., description="订单ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取订单详情"""
    order = OrderService.get_order_detail(db, current_user_id, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在"
        )
    return order


@router.post("/pay", response_model=OrderResponse)
def pay_order(
    order_id: int = Query(..., description="订单ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """付款（模拟）"""
    return OrderService.pay_order(db, current_user_id, order_id)


@router.post("/receive", response_model=OrderResponse)
def receive_order(
    order_id: int = Query(..., description="订单ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """确认收货"""
    return OrderService.receive_order(db, current_user_id, order_id)


@router.post("/cancel", response_model=OrderResponse)
def cancel_order(
    order_id: int = Query(..., description="订单ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """取消订单"""
    return OrderService.cancel_order(db, current_user_id, order_id)


# ========== 内部管理API（供admin-service调用） ==========

@router.get("/admin/list", response_model=OrderListResponse)
def admin_get_order_list(
    status: str | None = Query(None, description="订单状态筛选"),
    db: Session = Depends(get_db),
):
    """获取所有订单列表（内部管理用）"""
    items = OrderService.admin_get_order_list(db, status)
    return OrderListResponse(items=items)


@router.get("/admin/detail", response_model=OrderDetailResponse)
def admin_get_order_detail(
    order_id: int = Query(..., description="订单ID"),
    db: Session = Depends(get_db),
):
    """获取订单详情（内部管理用）"""
    order = OrderService.admin_get_order_detail(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在"
        )
    return order


@router.post("/admin/ship", response_model=OrderResponse)
def admin_ship_order(
    order_id: int = Query(..., description="订单ID"),
    db: Session = Depends(get_db),
):
    """发货（内部管理用）"""
    return OrderService.admin_ship_order(db, order_id)
