from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class OrderReturn(Base):
    __tablename__ = "order_returns"

    return_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    order_id = Column(Integer, nullable=False, index=True, comment="订单ID")
    user_id = Column(Integer, nullable=False, index=True, comment="用户ID")

    type = Column(String(20), nullable=False, default="return", comment="类型: return-退货, exchange-换货")
    status = Column(String(20), nullable=False, default="pending", comment="状态: pending-待审核, approved-已批准, rejected-已拒绝, completed-已完成")

    reason = Column(String(500), nullable=False, comment="申请原因")
    images = Column(Text, nullable=True, comment="图片，JSON数组格式")
    remark = Column(String(500), nullable=True, comment="备注")

    approve_remark = Column(String(500), nullable=True, comment="审核备注")

    create_time = Column(DateTime(timezone=True), server_default=func.now())
    update_time = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
