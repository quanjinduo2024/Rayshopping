from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime
from sqlalchemy.sql import func

from app.database import Base


class Goods(Base):
    __tablename__ = "goods"

    goods_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    intro = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    category = Column(String(50), nullable=True)
    stock = Column(Integer, default=0, nullable=False)
    create_time = Column(DateTime(timezone=True), server_default=func.now())
