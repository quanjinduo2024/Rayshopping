from sqlalchemy import Column, Integer, Boolean

from app.database import Base


class Cart(Base):
    __tablename__ = "cart"

    cart_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    goods_id = Column(Integer, nullable=False)
    quantity = Column(Integer, default=1, nullable=False)
    checked = Column(Boolean, default=True, nullable=False)
