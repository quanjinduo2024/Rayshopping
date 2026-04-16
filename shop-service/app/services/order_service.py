from typing import List
from decimal import Decimal
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order import Order, OrderItem
from app.models.cart import Cart
from app.models.goods import Goods
from app.schemas.order import (
    OrderCheckout,
    OrderCartCheckout,
    OrderResponse,
    OrderDetailResponse,
    OrderItemResponse,
)
from app.services.user_client import user_client


class OrderService:
    @staticmethod
    def get_order_list(db: Session, user_id: int) -> List[OrderResponse]:
        """获取用户订单列表"""
        orders = db.query(Order).filter(Order.user_id == user_id).order_by(Order.create_time.desc()).all()
        return [OrderResponse.model_validate(order) for order in orders]

    @staticmethod
    def get_order_detail(db: Session, user_id: int, order_id: int) -> OrderDetailResponse | None:
        """获取订单详情"""
        order = db.query(Order).filter(
            Order.order_id == order_id,
            Order.user_id == user_id
        ).first()

        if not order:
            return None

        items = []
        for item in order.items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            items.append(OrderItemResponse(
                item_id=item.item_id,
                goods_id=item.goods_id,
                goods_name=goods.name if goods else None,
                quantity=item.quantity,
                price=item.price
            ))

        return OrderDetailResponse(
            order_id=order.order_id,
            user_id=order.user_id,
            total_price=order.total_price,
            status=order.status,
            create_time=order.create_time,
            address_name=order.address_name,
            address_phone=order.address_phone,
            address_province=order.address_province,
            address_city=order.address_city,
            address_district=order.address_district,
            address_detail=order.address_detail,
            items=items
        )

    @staticmethod
    async def checkout_direct(db: Session, user_id: int, order_data: OrderCheckout) -> OrderResponse:
        """直接购买结算"""
        # 检查商品是否存在且库存足够
        goods = db.query(Goods).filter(Goods.goods_id == order_data.goods_id).first()
        if not goods:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="商品不存在"
            )
        if goods.stock < order_data.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="库存不足"
            )

        # 获取地址信息
        address_info = await user_client.get_address_detail(order_data.address_id, user_id)
        if not address_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="地址不存在"
            )

        # 计算总价
        total_price = goods.price * order_data.quantity

        # 创建订单（事务处理）
        order = Order(
            user_id=user_id,
            total_price=total_price,
            status="pending_payment",
            address_name=address_info.get("name"),
            address_phone=address_info.get("phone"),
            address_province=address_info.get("province"),
            address_city=address_info.get("city"),
            address_district=address_info.get("district"),
            address_detail=address_info.get("detail"),
        )
        db.add(order)
        db.flush()

        # 创建订单项
        order_item = OrderItem(
            order_id=order.order_id,
            goods_id=goods.goods_id,
            quantity=order_data.quantity,
            price=goods.price
        )
        db.add(order_item)

        # 扣减库存
        goods.stock -= order_data.quantity

        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)

    @staticmethod
    async def checkout_cart(db: Session, user_id: int, order_data: OrderCartCheckout) -> OrderResponse:
        """购物车结算"""
        # 获取选中的购物车项
        cart_items = db.query(Cart).filter(
            Cart.cart_id.in_(order_data.cart_ids),
            Cart.user_id == user_id,
            Cart.checked == True
        ).all()

        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="没有选中的商品"
            )

        # 获取地址信息
        address_info = await user_client.get_address_detail(order_data.address_id, user_id)
        if not address_info:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="地址不存在"
            )

        total_price = Decimal("0")
        order_items_data = []

        # 验证所有商品库存
        for item in cart_items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            if not goods:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"商品 {item.goods_id} 不存在"
                )
            if goods.stock < item.quantity:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"商品 {goods.name} 库存不足"
                )

            total_price += goods.price * item.quantity
            order_items_data.append({
                "goods_id": goods.goods_id,
                "quantity": item.quantity,
                "price": goods.price,
                "goods": goods,
                "cart_item": item,
            })

        # 创建订单（事务处理）
        order = Order(
            user_id=user_id,
            total_price=total_price,
            status="pending_payment",
            address_name=address_info.get("name"),
            address_phone=address_info.get("phone"),
            address_province=address_info.get("province"),
            address_city=address_info.get("city"),
            address_district=address_info.get("district"),
            address_detail=address_info.get("detail"),
        )
        db.add(order)
        db.flush()

        # 创建订单项并扣减库存
        for item_data in order_items_data:
            order_item = OrderItem(
                order_id=order.order_id,
                goods_id=item_data["goods_id"],
                quantity=item_data["quantity"],
                price=item_data["price"]
            )
            db.add(order_item)

            # 扣减库存
            item_data["goods"].stock -= item_data["quantity"]

            # 删除购物车项
            db.delete(item_data["cart_item"])

        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)

    @staticmethod
    def pay_order(db: Session, user_id: int, order_id: int) -> OrderResponse:
        """付款（模拟）"""
        order = db.query(Order).filter(
            Order.order_id == order_id,
            Order.user_id == user_id
        ).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="订单不存在"
            )

        if order.status != "pending_payment":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="订单状态不允许付款"
            )

        order.status = "pending_shipment"
        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)

    @staticmethod
    def receive_order(db: Session, user_id: int, order_id: int) -> OrderResponse:
        """确认收货"""
        order = db.query(Order).filter(
            Order.order_id == order_id,
            Order.user_id == user_id
        ).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="订单不存在"
            )

        if order.status != "pending_receipt":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="订单状态不允许确认收货"
            )

        order.status = "completed"
        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)

    @staticmethod
    def cancel_order(db: Session, user_id: int, order_id: int) -> OrderResponse:
        """取消订单"""
        order = db.query(Order).filter(
            Order.order_id == order_id,
            Order.user_id == user_id
        ).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="订单不存在"
            )

        if order.status not in ["pending_payment", "pending_shipment"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="订单状态不允许取消"
            )

        # 恢复库存
        for item in order.items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            if goods:
                goods.stock += item.quantity

        order.status = "cancelled"
        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)

    @staticmethod
    def admin_get_order_list(db: Session, status_filter: str | None) -> List[Order]:
        """获取所有订单列表（管理用） - 返回原始 Order 对象"""
        query = db.query(Order).order_by(Order.create_time.desc())
        if status_filter:
            query = query.filter(Order.status == status_filter)
        return query.all()

    @staticmethod
    def admin_get_order_detail(db: Session, order_id: int) -> Order | None:
        """获取订单详情（管理用） - 返回原始 Order 对象"""
        return db.query(Order).filter(Order.order_id == order_id).first()

    @staticmethod
    def admin_get_order_detail_with_items(db: Session, order_id: int) -> OrderDetailResponse | None:
        """获取订单详情（包含商品项）"""
        order = db.query(Order).filter(Order.order_id == order_id).first()

        if not order:
            return None

        items = []
        for item in order.items:
            goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
            items.append(OrderItemResponse(
                item_id=item.item_id,
                goods_id=item.goods_id,
                goods_name=goods.name if goods else None,
                quantity=item.quantity,
                price=item.price
            ))

        return OrderDetailResponse(
            order_id=order.order_id,
            user_id=order.user_id,
            total_price=order.total_price,
            status=order.status,
            create_time=order.create_time,
            address_name=order.address_name,
            address_phone=order.address_phone,
            address_province=order.address_province,
            address_city=order.address_city,
            address_district=order.address_district,
            address_detail=order.address_detail,
            items=items
        )

    @staticmethod
    def admin_ship_order(db: Session, order_id: int) -> OrderResponse:
        """发货（管理用）"""
        order = db.query(Order).filter(Order.order_id == order_id).first()

        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="订单不存在"
            )

        if order.status != "pending_shipment":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="订单状态不允许发货"
            )

        order.status = "pending_receipt"
        db.commit()
        db.refresh(order)

        return OrderResponse.model_validate(order)
