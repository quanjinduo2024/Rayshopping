from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.admin import AdminLogin, Token
from app.schemas.order import OrderListResponse, OrderDetailResponse, OrderResponse
from app.services.admin_service import AdminService
from app.services.order_service import OrderService
from app.core.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])


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
    items = OrderService.admin_get_order_list(db, status)
    return OrderListResponse(items=items)


@router.get("/order/detail", response_model=OrderDetailResponse)
async def get_order_detail(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取订单详情"""
    from fastapi import HTTPException, status
    order = OrderService.admin_get_order_detail(db, order_id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="订单不存在"
        )
    return order


@router.post("/order/ship", response_model=OrderResponse)
async def ship_order(
    order_id: int = Query(..., description="订单ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """发货"""
    return OrderService.admin_ship_order(db, order_id)
