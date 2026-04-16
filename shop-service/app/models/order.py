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

    # 收货地址（快照保存）
    address_name = Column(String(50), nullable=True, comment="收货人姓名")
    address_phone = Column(String(20), nullable=True, comment="收货人电话")
    address_province = Column(String(50), nullable=True, comment="省份")
    address_city = Column(String(50), nullable=True, comment="城市")
    address_district = Column(String(50), nullable=True, comment="区县")
    address_detail = Column(String(200), nullable=True, comment="详细地址")

    items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"

    item_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id"), nullable=False)
    goods_id = Column(Integer, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
