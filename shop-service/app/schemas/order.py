from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from decimal import Decimal


class UserInfo(BaseModel):
    """用户基本信息（用于订单展示）"""
    user_id: int
    username: str
    phone: Optional[str] = None
    avatar: Optional[str] = None

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    total_price: Decimal
    status: str = "pending"


class OrderCheckout(BaseModel):
    goods_id: int
    quantity: int


class OrderCartCheckout(BaseModel):
    cart_ids: List[int]


class OrderResponse(OrderBase):
    order_id: int
    user_id: int
    create_time: datetime
    user_info: Optional[UserInfo] = None

    class Config:
        from_attributes = True


class OrderItemResponse(BaseModel):
    item_id: int
    goods_id: int
    goods_name: str | None = None
    quantity: int
    price: Decimal

    class Config:
        from_attributes = True


class OrderDetailResponse(OrderResponse):
    items: List[OrderItemResponse]

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
