"""
数据库初始化脚本
"""
from app.database import Base, engine, SessionLocal
from app.models import User


def init_db():
    """创建数据库表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")


if __name__ == "__main__":
    init_db()
