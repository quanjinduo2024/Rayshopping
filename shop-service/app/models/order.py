from sqlalchemy import Column, Integer, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    total_price = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    create_time = Column(DateTime(timezone=True), server_default=func.now())

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    item_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    goods_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
