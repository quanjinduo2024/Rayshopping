from typing import Tuple, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.models.goods import Goods
from app.schemas.goods import GoodsResponse


class GoodsService:
    @staticmethod
    def get_goods_by_id(db: Session, goods_id: int) -> Goods | None:
        """根据 ID 获取商品"""
        return db.query(Goods).filter(Goods.goods_id == goods_id).first()

    @staticmethod
    def get_goods_list(db: Session, page: int = 1, size: int = 20, category: Optional[str] = None) -> Tuple[List[GoodsResponse], int]:
        """获取商品列表，支持按分类筛选"""
        offset = (page - 1) * size
        query = db.query(Goods)

        # 按分类筛选
        if category:
            query = query.filter(Goods.category == category)

        total = query.count()
        items = query.order_by(Goods.create_time.desc()).offset(offset).limit(size).all()
        return [GoodsResponse.model_validate(item) for item in items], total
