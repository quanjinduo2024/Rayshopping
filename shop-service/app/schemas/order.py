from pydantic import BaseModel
from datetime import datetime
from typing import List
from decimal import Decimal


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
