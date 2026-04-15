from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.favorite import Favorite
from app.models.goods import Goods
from app.schemas.favorite import FavoriteResponse


class FavoriteService:
    @staticmethod
    def get_favorite_list(db: Session, user_id: int) -> List[FavoriteResponse]:
        """获取用户收藏列表"""
        favorite_items = db.query(Favorite).filter(Favorite.user_id == user_id).order_by(Favorite.create_time.desc()).all()
        result = []
        for item in favorite_items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            response = FavoriteResponse(
                favorite_id=item.favorite_id,
                user_id=item.user_id,
                goods_id=item.goods_id,
                goods_name=goods.name if goods else None,
                price=goods.price if goods else None,
                image_url=goods.image_url if goods else None,
                intro=goods.intro if goods else None,
                create_time=item.create_time
            )
            result.append(response)
        return result

    @staticmethod
    def add_favorite(db: Session, user_id: int, goods_id: int) -> FavoriteResponse:
        """添加收藏"""
        # 检查商品是否存在
        goods = db.query(Goods).filter(Goods.goods_id == goods_id).first()
        if not goods:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="商品不存在"
            )

        # 检查是否已收藏
        existing = db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.goods_id == goods_id
        ).first()

        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="该商品已收藏"
            )

        # 创建收藏
        favorite = Favorite(
            user_id=user_id,
            goods_id=goods_id
        )
        db.add(favorite)
        db.commit()
        db.refresh(favorite)

        return FavoriteResponse(
            favorite_id=favorite.favorite_id,
            user_id=favorite.user_id,
            goods_id=favorite.goods_id,
            goods_name=goods.name,
            price=goods.price,
            image_url=goods.image_url,
            intro=goods.intro,
            create_time=favorite.create_time
        )

    @staticmethod
    def remove_favorite(db: Session, user_id: int, goods_id: int):
        """取消收藏"""
        favorite = db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.goods_id == goods_id
        ).first()

        if not favorite:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="收藏不存在"
            )

        db.delete(favorite)
        db.commit()

    @staticmethod
    def check_is_favorited(db: Session, user_id: int, goods_id: int) -> bool:
        """检查商品是否已收藏"""
        favorite = db.query(Favorite).filter(
            Favorite.user_id == user_id,
            Favorite.goods_id == goods_id
        ).first()
        return favorite is not None

    @staticmethod
    def get_favorited_ids(db: Session, user_id: int) -> List[int]:
        """获取用户已收藏的商品ID列表"""
        favorites = db.query(Favorite).filter(Favorite.user_id == user_id).all()
        return [f.goods_id for f in favorites]
