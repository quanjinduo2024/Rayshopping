from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from app.database import Base


class Admin(Base):
    __tablename__ = "admins"

    admin_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    create_time = Column(DateTime, default=datetime.utcnow, nullable=False)
