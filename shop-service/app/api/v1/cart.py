from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.cart import CartCreate, CartUpdate, CartResponse, CartListResponse
from app.services.cart_service import CartService
from app.core.deps import get_current_user

router = APIRouter(prefix="/cart", tags=["cart"])


@router.post("/add", response_model=CartResponse)
def add_to_cart(
    cart_data: CartCreate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """添加商品到购物车"""
    return CartService.add_to_cart(db, current_user_id, cart_data)


@router.get("/list", response_model=CartListResponse)
def get_cart_list(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取购物车列表"""
    items = CartService.get_cart_list(db, current_user_id)
    return CartListResponse(items=items)


@router.put("/update", response_model=CartResponse)
def update_cart_item(
    cart_data: CartUpdate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """更新购物车项"""
    return CartService.update_cart_item(db, current_user_id, cart_data)


@router.delete("/delete")
def delete_cart_item(
    cart_id: int = Query(..., description="购物车项ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """删除购物车项"""
    CartService.delete_cart_item(db, current_user_id, cart_id)
    return {"success": True}
