from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.cart import Cart
from app.models.goods import Goods
from app.schemas.cart import CartCreate, CartUpdate, CartResponse


class CartService:
    @staticmethod
    def get_cart_list(db: Session, user_id: int) -> List[CartResponse]:
        """获取用户购物车列表"""
        cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
        result = []
        for item in cart_items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            response = CartResponse(
                cart_id=item.cart_id,
                user_id=item.user_id,
                goods_id=item.goods_id,
                goods_name=goods.name if goods else None,
                price=goods.price if goods else None,
                image_url=goods.image_url if goods else None,
                quantity=item.quantity,
                checked=item.checked
            )
            result.append(response)
        return result

    @staticmethod
    def add_to_cart(db: Session, user_id: int, cart_data: CartCreate) -> CartResponse:
        """添加商品到购物车"""
        # 检查商品是否存在
        goods = db.query(Goods).filter(Goods.goods_id == cart_data.goods_id).first()
        if not goods:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="商品不存在"
            )

        # 检查购物车中是否已有该商品
        existing = db.query(Cart).filter(
            Cart.user_id == user_id,
            Cart.goods_id == cart_data.goods_id
        ).first()

        if existing:
            # 已有则增加数量
            existing.quantity += cart_data.quantity
            db.commit()
            db.refresh(existing)
            cart_item = existing
        else:
            # 没有则新建
            cart_item = Cart(
                user_id=user_id,
                goods_id=cart_data.goods_id,
                quantity=cart_data.quantity
            )
            db.add(cart_item)
            db.commit()
            db.refresh(cart_item)

        return CartResponse(
            cart_id=cart_item.cart_id,
            user_id=cart_item.user_id,
            goods_id=cart_item.goods_id,
            goods_name=goods.name,
            price=goods.price,
            image_url=goods.image_url,
            quantity=cart_item.quantity,
            checked=cart_item.checked
        )

    @staticmethod
    def update_cart_item(db: Session, user_id: int, cart_data: CartUpdate) -> CartResponse:
        """更新购物车项"""
        cart_item = db.query(Cart).filter(
            Cart.cart_id == cart_data.cart_id,
            Cart.user_id == user_id
        ).first()

        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="购物车项不存在"
            )

        if cart_data.quantity is not None:
            cart_item.quantity = cart_data.quantity
        if cart_data.checked is not None:
            cart_item.checked = cart_data.checked

        db.commit()
        db.refresh(cart_item)

        goods = db.query(Goods).filter(Goods.goods_id == cart_item.goods_id).first()

        return CartResponse(
            cart_id=cart_item.cart_id,
            user_id=cart_item.user_id,
            goods_id=cart_item.goods_id,
            goods_name=goods.name if goods else None,
            price=goods.price if goods else None,
            image_url=goods.image_url if goods else None,
            quantity=cart_item.quantity,
            checked=cart_item.checked
        )

    @staticmethod
    def delete_cart_item(db: Session, user_id: int, cart_id: int):
        """删除购物车项"""
        cart_item = db.query(Cart).filter(
            Cart.cart_id == cart_id,
            Cart.user_id == user_id
        ).first()

        if not cart_item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="购物车项不存在"
            )

        db.delete(cart_item)
        db.commit()
