from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.favorite import (
    FavoriteCreate, FavoriteResponse, FavoriteListResponse,
    FavoriteCheckResponse, FavoriteIdsResponse
)
from app.services.favorite_service import FavoriteService
from app.core.deps import get_current_user

router = APIRouter(prefix="/favorite", tags=["favorite"])


@router.post("/add", response_model=FavoriteResponse)
def add_favorite(
    favorite_data: FavoriteCreate,
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """添加商品到收藏"""
    return FavoriteService.add_favorite(db, current_user_id, favorite_data.goods_id)


@router.delete("/remove")
def remove_favorite(
    goods_id: int = Query(..., description="商品ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """取消收藏商品"""
    FavoriteService.remove_favorite(db, current_user_id, goods_id)
    return {"success": True}


@router.get("/list", response_model=FavoriteListResponse)
def get_favorite_list(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取收藏列表"""
    items = FavoriteService.get_favorite_list(db, current_user_id)
    return FavoriteListResponse(items=items)


@router.get("/check", response_model=FavoriteCheckResponse)
def check_favorite(
    goods_id: int = Query(..., description="商品ID"),
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """检查商品是否已收藏"""
    is_favorited = FavoriteService.check_is_favorited(db, current_user_id, goods_id)
    return FavoriteCheckResponse(is_favorited=is_favorited)


@router.get("/ids", response_model=FavoriteIdsResponse)
def get_favorite_ids(
    current_user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """获取已收藏的商品ID列表"""
    ids = FavoriteService.get_favorited_ids(db, current_user_id)
    return FavoriteIdsResponse(ids=ids)
