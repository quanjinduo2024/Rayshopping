"""
初始化管理员账号脚本
"""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal, engine, Base
from app.models.admin import Admin
from app.services.admin_service import AdminService

# 创建数据库表
Base.metadata.create_all(bind=engine)


def init_admin():
    """初始化默认管理员"""
    db = SessionLocal()
    try:
        print("正在初始化管理员账号...")
        admin = AdminService.create_admin(db, "admin", "admin123")
        print(f"管理员创建成功！")
        print(f"用户名: admin")
        print(f"密码: admin123")
        print(f"请及时修改默认密码！")
    except Exception as e:
        print(f"初始化管理员时出错: {e}")
        print("管理员可能已存在，请直接登录")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    init_admin()
