"""
添加 addresses 表的迁移脚本
"""
import sys
import os

# 添加项目根目录到 Python 路径
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import engine
from sqlalchemy import text


def add_address_table():
    """创建 addresses 表"""
    print("正在创建 addresses 表...")

    with engine.connect() as conn:
        # 检查表是否已存在
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='addresses'"))
        if result.fetchone():
            print("addresses 表已存在，跳过创建")
            return

        # 创建 addresses 表
        create_table_sql = """
        CREATE TABLE addresses (
            address_id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name VARCHAR(50) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            province VARCHAR(50) NOT NULL,
            city VARCHAR(50) NOT NULL,
            district VARCHAR(50) NOT NULL,
            detail VARCHAR(200) NOT NULL,
            is_default BOOLEAN DEFAULT 0,
            create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            update_time DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (user_id)
        );
        """
        conn.execute(text(create_table_sql))

        # 创建索引
        conn.execute(text("CREATE INDEX ix_addresses_address_id ON addresses (address_id)"))
        conn.execute(text("CREATE INDEX ix_addresses_user_id ON addresses (user_id)"))

        conn.commit()
        print("addresses 表创建完成！")


if __name__ == "__main__":
    add_address_table()
