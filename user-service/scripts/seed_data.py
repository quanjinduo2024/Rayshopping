"""
测试数据填充脚本
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash


def seed_data():
    """填充测试数据"""
    db = SessionLocal()
    try:
        print("正在填充测试数据...")

        # 创建测试用户
        test_users = [
            {
                "username": "testuser1",
                "password": "password123",
                "phone": "13800138001"
            },
            {
                "username": "testuser2",
                "password": "password123",
                "phone": "13800138002"
            },
        ]

        for user_data in test_users:
            existing = db.query(User).filter(User.username == user_data["username"]).first()
            if not existing:
                hashed_password = get_password_hash(user_data["password"])
                user = User(
                    username=user_data["username"],
                    password=hashed_password,
                    phone=user_data["phone"]
                )
                db.add(user)
                print(f"创建用户: {user_data['username']}")

        db.commit()
        print("测试数据填充完成！")

    except Exception as e:
        print(f"填充数据时出错: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
