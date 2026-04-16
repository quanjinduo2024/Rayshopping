from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
from decimal import Decimal


class GoodsBase(BaseModel):
    name: str
    price: Decimal
    intro: str | None = None
    description: str | None = None
    image_url: str | None = None
    category: str | None = None
    stock: int = 0


class GoodsCreate(GoodsBase):
    """创建商品时的请求模型"""
    pass


class GoodsUpdate(BaseModel):
    """更新商品时的请求模型"""
    name: Optional[str] = None
    price: Optional[Decimal] = None
    intro: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    stock: Optional[int] = None


class GoodsResponse(GoodsBase):
    goods_id: int
    create_time: datetime

    class Config:
        from_attributes = True


class GoodsListResponse(BaseModel):
    items: List[GoodsResponse]
    total: int
