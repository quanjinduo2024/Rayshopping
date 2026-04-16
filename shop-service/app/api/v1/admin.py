import httpx
import asyncio
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.config import settings
from app.database import get_db
from app.schemas.admin import AdminLogin, Token, StatsOverview
from app.schemas.order import OrderListResponse, OrderDetailResponse, OrderResponse, OrderResponse, UserInfo
from app.schemas.goods import GoodsListResponse, GoodsResponse, GoodsCreate, GoodsUpdate
from app.services.admin_service import AdminService
from app.services.order_service import OrderService
from app.services.goods_service import GoodsService
from app.services.user_client import user_client
from app.models.order import Order
from app.models.goods import Goods
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
    user_id: int | None = Query(None, description="用户ID筛选"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取订单列表"""
    orders = OrderService.admin_get_order_list(db, status, user_id)
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


# ==================== 商品管理接口 ====================

@router.get("/goods/list", response_model=GoodsListResponse)
def get_goods_list(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(20, ge=1, le=100, description="每页数量"),
    category: str | None = Query(None, description="商品分类"),
    search: str | None = Query(None, description="搜索关键词"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取商品列表"""
    items, total = GoodsService.get_goods_list(db, page=page, size=size, category=category, search=search)
    return GoodsListResponse(items=items, total=total)


@router.get("/goods/detail", response_model=GoodsResponse)
def get_goods_detail(
    goods_id: int = Query(..., description="商品ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取商品详情"""
    goods = GoodsService.get_goods_by_id(db, goods_id)
    if not goods:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在"
        )
    return GoodsResponse.model_validate(goods)


@router.post("/goods/create", response_model=GoodsResponse)
def create_goods(
    goods_data: GoodsCreate,
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """创建商品"""
    goods = GoodsService.create_goods(db, goods_data)
    return GoodsResponse.model_validate(goods)


@router.put("/goods/update", response_model=GoodsResponse)
def update_goods(
    goods_id: int = Query(..., description="商品ID"),
    goods_data: GoodsUpdate = ...,
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """更新商品"""
    goods = GoodsService.update_goods(db, goods_id, goods_data)
    if not goods:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在"
        )
    return GoodsResponse.model_validate(goods)


@router.delete("/goods/delete")
def delete_goods(
    goods_id: int = Query(..., description="商品ID"),
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """删除商品"""
    success = GoodsService.delete_goods(db, goods_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="商品不存在"
        )
    return {"message": "删除成功"}


# ==================== 统计接口 ====================

@router.get("/stats/overview", response_model=StatsOverview)
def get_stats_overview(
    current_admin_id: int = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """获取统计概览"""
    # 订单统计
    total_orders = db.query(func.count(Order.order_id)).scalar() or 0
    pending_payment_count = db.query(func.count(Order.order_id)).filter(Order.status == "pending_payment").scalar() or 0
    pending_shipment_count = db.query(func.count(Order.order_id)).filter(Order.status == "pending_shipment").scalar() or 0
    pending_receipt_count = db.query(func.count(Order.order_id)).filter(Order.status == "pending_receipt").scalar() or 0
    completed_count = db.query(func.count(Order.order_id)).filter(Order.status == "completed").scalar() or 0

    # 销售额统计（仅已完成订单）
    total_sales = db.query(func.sum(Order.total_price)).filter(Order.status == "completed").scalar() or 0

    # 商品统计
    total_goods = db.query(func.count(Goods.goods_id)).scalar() or 0

    return StatsOverview(
        total_orders=total_orders,
        total_users=0,  # 后续通过user-service获取
        total_goods=total_goods,
        total_sales=total_sales,
        pending_payment_count=pending_payment_count,
        pending_shipment_count=pending_shipment_count,
        pending_receipt_count=pending_receipt_count,
        completed_count=completed_count,
    )


# ==================== 用户管理接口（代理到user-service） ====================

@router.get("/user/list")
async def get_user_list(
    page: int = Query(1, ge=1, description="页码"),
    size: int = Query(20, ge=1, le=100, description="每页数量"),
    current_admin_id: int = Depends(get_current_admin),
):
    """获取用户列表（代理到user-service）"""
    user_list = await user_client.get_user_list(page, size)
    if user_list is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="获取用户列表失败"
        )
    return user_list


@router.get("/user/detail")
async def get_user_detail(
    user_id: int = Query(..., description="用户ID"),
    current_admin_id: int = Depends(get_current_admin),
):
    """获取用户详情（代理到user-service）"""
    user_info = await user_client.get_user_detail(user_id)
    if user_info is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="用户不存在"
        )
    return user_info
