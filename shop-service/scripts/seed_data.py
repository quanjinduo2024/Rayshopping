"""
测试数据填充脚本
"""
from app.database import SessionLocal
from app.models import Goods


def seed_data():
    """填充测试数据"""
    db = SessionLocal()
    try:
        print("正在填充测试数据...")

        # 创建测试商品
        test_goods = [
            {
                "name": "iPhone 15 Pro",
                "price": 7999.00,
                "intro": "苹果最新旗舰手机",
                "image_url": "/images/iphone15.jpg",
                "stock": 100
            },
            {
                "name": "MacBook Pro 14",
                "price": 14999.00,
                "intro": "M3 芯片专业笔记本",
                "image_url": "/images/macbook.jpg",
                "stock": 50
            },
            {
                "name": "AirPods Pro 2",
                "price": 1899.00,
                "intro": "主动降噪无线耳机",
                "image_url": "/images/airpods.jpg",
                "stock": 200
            },
            {
                "name": "iPad Air",
                "price": 4799.00,
                "intro": "轻薄便携平板电脑",
                "image_url": "/images/ipad.jpg",
                "stock": 80
            },
            {
                "name": "Apple Watch Series 9",
                "price": 2999.00,
                "intro": "智能健康手表",
                "image_url": "/images/watch.jpg",
                "stock": 120
            },
        ]

        for goods_data in test_goods:
            existing = db.query(Goods).filter(Goods.name == goods_data["name"]).first()
            if not existing:
                goods = Goods(**goods_data)
                db.add(goods)
                print(f"创建商品: {goods_data['name']}")

        db.commit()
        print("测试数据填充完成！")

    except Exception as e:
        print(f"填充数据时出错: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
