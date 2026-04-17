from typing import List, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.order_return import OrderReturn
from app.models.order import Order, OrderItem
from app.models.goods import Goods
from app.schemas.order_return import OrderReturnCreate, OrderReturnApprove


class OrderReturnService:
    @staticmethod
    def create_return(db: Session, user_id: int, return_data: OrderReturnCreate) -> OrderReturn:
        """创建退换货申请"""
        # 验证订单存在且属于该用户
        order = db.query(Order).filter(
            Order.order_id == return_data.order_id,
            Order.user_id == user_id
        ).first()
        if not order:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="订单不存在"
            )

        # 验证订单状态 - 已完成订单可以申请退换货
        if order.status not in ["pending_receipt", "completed"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="订单状态不允许申请退换货"
            )

        # 创建申请
        db_return = OrderReturn(
            order_id=return_data.order_id,
            user_id=user_id,
            type=return_data.type,
            reason=return_data.reason,
            images=return_data.images,
            remark=return_data.remark,
            status="pending"
        )
        db.add(db_return)
        db.commit()
        db.refresh(db_return)
        return db_return

    @staticmethod
    def get_return_list_by_user(
        db: Session,
        user_id: int,
        page: int = 1,
        size: int = 20
    ) -> Tuple[List[OrderReturn], int]:
        """获取用户的退换货申请列表"""
        query = db.query(OrderReturn).filter(OrderReturn.user_id == user_id)
        total = query.count()
        offset = (page - 1) * size
        items = query.order_by(OrderReturn.create_time.desc()).offset(offset).limit(size).all()
        return items, total

    @staticmethod
    def get_return_list_admin(
        db: Session,
        status_filter: str | None = None,
        user_id_filter: int | None = None,
        page: int = 1,
        size: int = 20
    ) -> Tuple[List[OrderReturn], int]:
        """获取退换货申请列表（管理员）"""
        query = db.query(OrderReturn)
        if status_filter:
            query = query.filter(OrderReturn.status == status_filter)
        if user_id_filter:
            query = query.filter(OrderReturn.user_id == user_id_filter)
        total = query.count()
        offset = (page - 1) * size
        items = query.order_by(OrderReturn.create_time.desc()).offset(offset).limit(size).all()
        return items, total

    @staticmethod
    def get_return_detail(db: Session, return_id: int) -> OrderReturn | None:
        """获取退换货申请详情"""
        return db.query(OrderReturn).filter(OrderReturn.return_id == return_id).first()

    @staticmethod
    def get_return_detail_by_user(db: Session, return_id: int, user_id: int) -> OrderReturn | None:
        """获取退换货申请详情（用户）"""
        return db.query(OrderReturn).filter(
            OrderReturn.return_id == return_id,
            OrderReturn.user_id == user_id
        ).first()

    @staticmethod
    def approve_return(db: Session, return_id: int, approve_data: OrderReturnApprove) -> OrderReturn:
        """审核退换货申请"""
        db_return = db.query(OrderReturn).filter(OrderReturn.return_id == return_id).first()
        if not db_return:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="申请不存在"
            )

        if db_return.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="申请状态不允许审核"
            )

        if approve_data.approve:
            db_return.status = "approved"
            # 如果是退货，恢复库存
            if db_return.type == "return":
                order = db.query(Order).filter(Order.order_id == db_return.order_id).first()
                if order:
                    for item in order.items:
                        goods = db.query(Goods).filter(Goods.goods_id == item.goods_id).first()
                        if goods:
                            goods.stock += item.quantity
        else:
            db_return.status = "rejected"

        db_return.approve_remark = approve_data.approve_remark
        db.commit()
        db.refresh(db_return)
        return db_return

    @staticmethod
    def complete_return(db: Session, return_id: int) -> OrderReturn:
        """完成退换货处理"""
        db_return = db.query(OrderReturn).filter(OrderReturn.return_id == return_id).first()
        if not db_return:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="申请不存在"
            )

        if db_return.status != "approved":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="申请状态不允许完成"
            )

        db_return.status = "completed"

        # 如果是退货，更新订单状态为已退款
        if db_return.type == "return":
            order = db.query(Order).filter(Order.order_id == db_return.order_id).first()
            if order:
                order.status = "refunded"

        db.commit()
        db.refresh(db_return)
        return db_return
