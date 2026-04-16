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


class OrderAddress(BaseModel):
    """订单收货地址"""
    address_name: Optional[str] = None
    address_phone: Optional[str] = None
    address_province: Optional[str] = None
    address_city: Optional[str] = None
    address_district: Optional[str] = None
    address_detail: Optional[str] = None

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    total_price: Decimal
    status: str = "pending"


class OrderCheckout(BaseModel):
    goods_id: int
    quantity: int
    address_id: int


class OrderCartCheckout(BaseModel):
    cart_ids: List[int]
    address_id: int


class OrderResponse(OrderBase, OrderAddress):
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
