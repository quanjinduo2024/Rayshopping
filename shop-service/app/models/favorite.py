from sqlalchemy import Column, Integer, DateTime
from datetime import datetime

from app.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

    favorite_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    goods_id = Column(Integer, nullable=False, index=True)
    create_time = Column(DateTime, default=datetime.utcnow, nullable=False)
