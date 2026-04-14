from pydantic import BaseModel
from typing import List
from decimal import Decimal


class CartBase(BaseModel):
    goods_id: int
    quantity: int = 1
    checked: bool = True


class CartCreate(BaseModel):
    goods_id: int
    quantity: int = 1


class CartUpdate(BaseModel):
    cart_id: int
    quantity: int | None = None
    checked: bool | None = None


class CartResponse(BaseModel):
    cart_id: int
    user_id: int
    goods_id: int
    goods_name: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    quantity: int
    checked: bool

    class Config:
        from_attributes = True


class CartListResponse(BaseModel):
    items: List[CartResponse]
