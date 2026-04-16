from typing import Tuple, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.models.goods import Goods
from app.schemas.goods import GoodsResponse, GoodsCreate, GoodsUpdate


class GoodsService:
    @staticmethod
    def get_goods_by_id(db: Session, goods_id: int) -> Goods | None:
        """根据 ID 获取商品"""
        return db.query(Goods).filter(Goods.goods_id == goods_id).first()

    @staticmethod
    def get_goods_list(
        db: Session,
        page: int = 1,
        size: int = 20,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> Tuple[List[GoodsResponse], int]:
        """获取商品列表，支持按分类筛选和搜索"""
        offset = (page - 1) * size
        query = db.query(Goods)

        # 按分类筛选
        if category:
            query = query.filter(Goods.category == category)

        # 按名称搜索
        if search:
            query = query.filter(Goods.name.contains(search))

        total = query.count()
        items = query.order_by(Goods.create_time.desc()).offset(offset).limit(size).all()
        return [GoodsResponse.model_validate(item) for item in items], total

    @staticmethod
    def create_goods(db: Session, goods_data: GoodsCreate) -> Goods:
        """创建商品"""
        goods = Goods(**goods_data.model_dump())
        db.add(goods)
        db.commit()
        db.refresh(goods)
        return goods

    @staticmethod
    def update_goods(db: Session, goods_id: int, goods_data: GoodsUpdate) -> Goods | None:
        """更新商品"""
        goods = db.query(Goods).filter(Goods.goods_id == goods_id).first()
        if not goods:
            return None

        update_data = goods_data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(goods, field, value)

        db.commit()
        db.refresh(goods)
        return goods

    @staticmethod
    def delete_goods(db: Session, goods_id: int) -> bool:
        """删除商品"""
        goods = db.query(Goods).filter(Goods.goods_id == goods_id).first()
        if not goods:
            return False

        db.delete(goods)
        db.commit()
        return True
