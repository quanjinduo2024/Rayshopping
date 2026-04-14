from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.goods import GoodsResponse, GoodsListResponse
from app.services.goods_service import GoodsService

router = APIRouter(prefix="/goods", tags=["goods"])


@router.get("/list", response_model=GoodsListResponse)
def get_goods_list(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """获取商品列表"""
    items, total = GoodsService.get_goods_list(db, page=page, size=size)
    return GoodsListResponse(items=items, total=total)


@router.get("/detail", response_model=GoodsResponse)
def get_goods_detail(
    goods_id: int = Query(..., description="商品ID"),
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
