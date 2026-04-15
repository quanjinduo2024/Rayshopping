"""
数据库初始化脚本
"""
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import Base, engine
from app.models.goods import Goods
from app.models.cart import Cart
from app.models.order import Order, OrderItem


def init_db():
    """创建数据库表"""
    print("正在创建数据库表...")
    Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")


if __name__ == "__main__":
    init_db()
