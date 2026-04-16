from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class Address(Base):
    """收货地址模型"""
    __tablename__ = "addresses"

    address_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, index=True)
    name = Column(String(50), nullable=False, comment="收货人姓名")
    phone = Column(String(20), nullable=False, comment="手机号码")
    province = Column(String(50), nullable=False, comment="省份")
    city = Column(String(50), nullable=False, comment="城市")
    district = Column(String(50), nullable=False, comment="区县")
    detail = Column(String(200), nullable=False, comment="详细地址")
    is_default = Column(Boolean, default=False, comment="是否默认地址")
    create_time = Column(DateTime(timezone=True), server_default=func.now())
    update_time = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="addresses")
