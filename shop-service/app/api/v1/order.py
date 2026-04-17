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
from app.schemas.order_return import (
    OrderReturnCreate,
    OrderReturnResponse,
    OrderReturnListResponse,
)
from app.services.order_service import OrderService
from app.services.order_return_service import OrderReturnService
from app.core.deps import get_current_user

router = APIRouter(prefix="/order", tags=["order"])


@router.post("/checkout", response_model=OrderResponse)
async def checkout_direct(
    order_data: OrderCheckout,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """直接购买结算"""
    return await OrderService.checkout_direct(db, current_user_id, order_data)


@router.post("/checkout/cart", response_model=OrderResponse)
async def checkout_cart(
    order_data: OrderCartCheckout,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """购物车结算"""
    return await OrderService.checkout_cart(db, current_user_id, order_data)


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


# ==================== 退换货接口 ====================

@router.post("/return/create", response_model=OrderReturnResponse)
def create_return(
    return_data: OrderReturnCreate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """发起退换货申请"""
    return OrderReturnService.create_return(db, current_user_id, return_data)


@router.get("/return/list", response_model=OrderReturnListResponse)
def get_return_list(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取我的退换货申请列表"""
    items, total = OrderReturnService.get_return_list_by_user(db, current_user_id, page, size)
    return OrderReturnListResponse(
        items=[OrderReturnResponse.model_validate(item) for item in items],
        total=total
    )


@router.get("/return/detail", response_model=OrderReturnResponse)
def get_return_detail(
    return_id: int = Query(..., description="申请ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取退换货申请详情"""
    db_return = OrderReturnService.get_return_detail_by_user(db, return_id, current_user_id)
    if not db_return:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="申请不存在"
        )
    return OrderReturnResponse.model_validate(db_return)
