from pydantic import BaseModel
from datetime import datetime
from typing import List
from decimal import Decimal


class GoodsBase(BaseModel):
    name: str
    price: Decimal
    intro: str | None = None
    image_url: str | None = None
    stock: int = 0


class GoodsResponse(GoodsBase):
    goods_id: int
    create_time: datetime

    class Config:
        from_attributes = True


class GoodsListResponse(BaseModel):
    items: List[GoodsResponse]
    total: int
