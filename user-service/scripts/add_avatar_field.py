#!/usr/bin/env python3
"""
添加头像字段到用户表
"""
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database import engine
from app.models.user import Base
from sqlalchemy import text

def add_avatar_field():
    """添加头像字段"""
    print("=" * 50)
    print("Adding avatar field to users table")
    print("=" * 50)

    with engine.connect() as conn:
        # 检查字段是否已存在
        result = conn.execute(text("PRAGMA table_info(users)"))
        columns = [row[1] for row in result.fetchall()]

        if 'avatar' in columns:
            print("Avatar field already exists!")
        else:
            print("Adding avatar field...")
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar VARCHAR(500)"))
            conn.commit()
            print("Avatar field added successfully!")

    print("\nDone!")
    print("=" * 50)

if __name__ == "__main__":
    add_avatar_field()
