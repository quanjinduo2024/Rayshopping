from pydantic import BaseModel
from typing import List
from decimal import Decimal
from datetime import datetime


class FavoriteBase(BaseModel):
    goods_id: int


class FavoriteCreate(BaseModel):
    goods_id: int


class FavoriteResponse(BaseModel):
    favorite_id: int
    user_id: int
    goods_id: int
    goods_name: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    intro: str | None = None
    create_time: datetime

    class Config:
        from_attributes = True


class FavoriteListResponse(BaseModel):
    items: List[FavoriteResponse]


class FavoriteCheckResponse(BaseModel):
    is_favorited: bool


class FavoriteIdsResponse(BaseModel):
    ids: List[int]
