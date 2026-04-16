"""
数据库迁移脚本 - 添加新字段
"""
import sqlite3
import os
import sys

# 添加项目根目录到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

def migrate_db():
    """迁移数据库"""
    db_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'sqlite', 'shop.db')
    db_path = os.path.abspath(db_path)

    if not os.path.exists(db_path):
        print(f"数据库文件不存在: {db_path}")
        print("请先运行 init_db.py 创建数据库")
        return

    print(f"正在迁移数据库: {db_path}")

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # 检查并添加 goods 表字段
        cursor.execute("PRAGMA table_info(goods)")
        columns = [col[1] for col in cursor.fetchall()]

        if 'description' not in columns:
            print("添加 description 字段...")
            cursor.execute("ALTER TABLE goods ADD COLUMN description TEXT")
        else:
            print("description 字段已存在")

        if 'category' not in columns:
            print("添加 category 字段...")
            cursor.execute("ALTER TABLE goods ADD COLUMN category VARCHAR(50)")
        else:
            print("category 字段已存在")

        # 检查并添加 orders 表地址字段
        cursor.execute("PRAGMA table_info(orders)")
        order_columns = [col[1] for col in cursor.fetchall()]

        address_fields = [
            ('address_name', 'VARCHAR(50)'),
            ('address_phone', 'VARCHAR(20)'),
            ('address_province', 'VARCHAR(50)'),
            ('address_city', 'VARCHAR(50)'),
            ('address_district', 'VARCHAR(50)'),
            ('address_detail', 'VARCHAR(200)'),
        ]

        for field_name, field_type in address_fields:
            if field_name not in order_columns:
                print(f"添加 {field_name} 字段...")
                cursor.execute(f"ALTER TABLE orders ADD COLUMN {field_name} {field_type}")
            else:
                print(f"{field_name} 字段已存在")

        conn.commit()
        print("数据库迁移完成！")

    except Exception as e:
        print(f"迁移数据库时出错: {e}")
        conn.rollback()
    finally:
        conn.close()


if __name__ == "__main__":
    migrate_db()
