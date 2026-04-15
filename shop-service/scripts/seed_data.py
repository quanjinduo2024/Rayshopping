"""
测试数据填充脚本 - 20+ 商品多分类
"""
import sys
import os

# 添加项目根目录到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.goods import Goods


def seed_data():
    """填充测试数据"""
    db = SessionLocal()
    try:
        print("正在填充测试数据...")

        # 创建 24 个示例商品，覆盖多个分类
        test_goods = [
            # 手机数码 (6个)
            {
                "name": "iPhone 15 Pro Max",
                "price": 9999.00,
                "intro": "苹果最新旗舰手机，A17 Pro芯片",
                "description": """iPhone 15 Pro Max 采用钛金属设计，搭载 A17 Pro 芯片，
配备 4800 万像素主摄，支持 USB-C 接口和 ProMotion 自适应刷新率。
拥有强大的摄像能力和超长续航时间，是专业用户的首选。

产品特点：
- 钛金属设计，轻便坚固
- A17 Pro 芯片，性能强劲
- 4800 万像素主摄，支持 4K 视频录制
- USB-C 接口，传输更快
- 全天候电池续航
""",
                "image_url": "https://picsum.photos/400/400?random=1",
                "category": "手机数码",
                "stock": 100
            },
            {
                "name": "小米 14 Ultra",
                "price": 6499.00,
                "intro": "徕卡专业影像，骁龙8 Gen3",
                "description": """小米 14 Ultra 搭载徕卡专业影像系统，配备一英寸大底主摄，
骁龙8 Gen3 处理器，超大内存组合。专业级影像能力，无论是拍照还是视频都能轻松应对。

产品特点：
- 徕卡专业影像系统
- 一英寸大底主摄
- 骁龙8 Gen3 处理器
- 超大电池，支持快充
- 徕卡联名滤镜
""",
                "image_url": "https://picsum.photos/400/400?random=2",
                "category": "手机数码",
                "stock": 150
            },
            {
                "name": "华为 Mate 60 Pro",
                "price": 6999.00,
                "intro": "遥遥领先，国产旗舰",
                "description": """华为 Mate 60 Pro 搭载全新麒麟芯片，支持卫星通话功能，
超可靠玄武架构，全方位守护手机安全。突破性技术，让你体验不一样的旗舰。

产品特点：
- 卫星通话功能
- 麒麟旗舰芯片
- 超可靠玄武架构
- 星环相机设计
- 鸿蒙操作系统
""",
                "image_url": "https://picsum.photos/400/400?random=3",
                "category": "手机数码",
                "stock": 80
            },
            {
                "name": "OPPO Find X7 Ultra",
                "price": 5999.00,
                "intro": "双潜望长焦，哈苏影像",
                "description": """OPPO Find X7 Ultra 搭载双潜望长焦镜头，哈苏专业影像调校，
天玑 9300 处理器，带来极致的影像体验和性能表现。

产品特点：
- 双潜望长焦镜头
- 哈苏专业影像
- 天玑 9300 处理器
- 100W 超级闪充
- 金属中框设计
""",
                "image_url": "https://picsum.photos/400/400?random=4",
                "category": "手机数码",
                "stock": 120
            },
            {
                "name": "vivo X100 Pro",
                "price": 4999.00,
                "intro": "蔡司一英寸主摄，蓝晶芯片",
                "description": """vivo X100 Pro 搭载蔡司一英寸主摄，蓝晶天玑 9300 处理器，
自研影像芯片 V3，带来专业级的影像能力。

产品特点：
- 蔡司一英寸主摄
- 天玑 9300 处理器
- 自研影像芯片 V3
- 120W 双芯闪充
- 蔡司光学镜头
""",
                "image_url": "https://picsum.photos/400/400?random=5",
                "category": "手机数码",
                "stock": 90
            },
            {
                "name": "三星 Galaxy S24 Ultra",
                "price": 9699.00,
                "intro": "AI智能手机，S Pen书写",
                "description": """三星 Galaxy S24 Ultra 搭载 AI 智能助手，内置 S Pen 手写笔，
2亿像素主摄，钛金属机身，是商务人士的最佳选择。

产品特点：
- AI 智能助手
- 内置 S Pen
- 2亿像素主摄
- 钛金属机身
- 顶级屏幕素质
""",
                "image_url": "https://picsum.photos/400/400?random=6",
                "category": "手机数码",
                "stock": 70
            },

            # 电脑办公 (5个)
            {
                "name": "MacBook Pro 14英寸",
                "price": 14999.00,
                "intro": "M3 Pro芯片，专业性能",
                "description": """MacBook Pro 14英寸搭载 M3 Pro 芯片，Liquid Retina XDR 显示屏，
超长续航时间，是创意工作者的终极工具。

产品特点：
- M3 Pro 芯片
- Liquid Retina XDR 显示屏
- 最长 17 小时续航
- HDMI、SD卡插槽
- 专业级散热系统
""",
                "image_url": "https://picsum.photos/400/400?random=7",
                "category": "电脑办公",
                "stock": 50
            },
            {
                "name": "ThinkPad X1 Carbon",
                "price": 11999.00,
                "intro": "极致轻薄，商务旗舰",
                "description": """ThinkPad X1 Carbon 采用碳纤维材质，重量仅 1.12kg，
配备 2.8K OLED 屏幕，超长续航，是商务出差的首选。

产品特点：
- 碳纤维机身，1.12kg
- 2.8K OLED 屏幕
- 超长电池续航
- 经典小红点设计
- 军规品质认证
""",
                "image_url": "https://picsum.photos/400/400?random=8",
                "category": "电脑办公",
                "stock": 60
            },
            {
                "name": "iPad Air 5",
                "price": 4799.00,
                "intro": "M1芯片，轻薄便携",
                "description": """iPad Air 5 搭载 M1 芯片，10.9 英寸 Liquid Retina 显示屏，
支持 Apple Pencil 和 Magic Keyboard，是学习和创作的好帮手。

产品特点：
- M1 芯片，性能强劲
- 10.9 英寸显示屏
- 支持 Apple Pencil
- USB-C 接口
- 轻薄便携设计
""",
                "image_url": "https://picsum.photos/400/400?random=9",
                "category": "电脑办公",
                "stock": 80
            },
            {
                "name": "罗技 MX Master 3S",
                "price": 899.00,
                "intro": "无线办公鼠标，精准高效",
                "description": """罗技 MX Master 3S 无线鼠标，8000 DPI 传感器，
MagSpeed 电磁滚轮，可在多种表面使用，是办公效率的利器。

产品特点：
- 8000 DPI 精准传感器
- MagSpeed 电磁滚轮
- 多设备同时连接
- 超长续航时间
- 人体工学设计
""",
                "image_url": "https://picsum.photos/400/400?random=10",
                "category": "电脑办公",
                "stock": 200
            },
            {
                "name": "HHKB Professional",
                "price": 2399.00,
                "intro": "静电容键盘，程序员首选",
                "description": """HHKB Professional 静电容键盘，采用独特的 Topre 轴体，
60% 紧凑布局，是程序员追求极致手感的选择。

产品特点：
- Topre 静电容轴体
- 60% 紧凑布局
- 经典设计
- 可编程按键
- 超长使用寿命
""",
                "image_url": "https://picsum.photos/400/400?random=11",
                "category": "电脑办公",
                "stock": 100
            },

            # 家电 (5个)
            {
                "name": "索尼 65英寸 4K电视",
                "price": 8999.00,
                "intro": "Mini LED背光，画质天花板",
                "description": """索尼 65英寸 4K 电视，采用 Mini LED 背光技术，
XR认知芯片，杜比视界/全景声，带来影院级的观影体验。

产品特点：
- Mini LED 背光
- XR 认知芯片
- 4K 120Hz 刷新率
- 杜比视界/全景声
- 多声道屏幕声场
""",
                "image_url": "https://picsum.photos/400/400?random=12",
                "category": "家电",
                "stock": 40
            },
            {
                "name": "格力 新一级能效空调",
                "price": 3999.00,
                "intro": "一级能效，省电静音",
                "description": """格力 新一级能效空调，采用凌达压缩机，
能效比高达 5.27，支持智能控制，静音运行，是家庭舒适之选。

产品特点：
- 新一级能效
- 凌达压缩机
- 智能控制
- 静音运行
- 自清洁功能
""",
                "image_url": "https://picsum.photos/400/400?random=13",
                "category": "家电",
                "stock": 80
            },
            {
                "name": "海尔 500L 对开门冰箱",
                "price": 4999.00,
                "intro": "大容量，风冷无霜",
                "description": """海尔 500L 对开门冰箱，采用风冷无霜技术，
智能控温系统，多路送风，让食材保鲜更持久。

产品特点：
- 500L 大容量
- 风冷无霜
- 智能控温
- 多路送风
- 节能静音
""",
                "image_url": "https://picsum.photos/400/400?random=14",
                "category": "家电",
                "stock": 60
            },
            {
                "name": "西门子 10kg 滚筒洗衣机",
                "price": 5999.00,
                "intro": "智能投放，除菌洗",
                "description": """西门子 10kg 滚筒洗衣机，支持智能投放洗衣液，
除菌洗程序，BLDC 变频电机，静音节能，呵护衣物健康。

产品特点：
- 智能投放洗衣液
- 除菌洗程序
- BLDC 变频电机
- 10kg 大容量
- 多种洗涤模式
""",
                "image_url": "https://picsum.photos/400/400?random=15",
                "category": "家电",
                "stock": 50
            },
            {
                "name": "美的 变频微波炉",
                "price": 599.00,
                "intro": "智能变频，平板加热",
                "description": """美的 变频微波炉，采用智能变频技术，
平板加热设计，多种烹饪菜单，让美食变得简单。

产品特点：
- 智能变频技术
- 平板加热设计
- 多种烹饪菜单
- 节能省电
- 安全童锁
""",
                "image_url": "https://picsum.photos/400/400?random=16",
                "category": "家电",
                "stock": 150
            },

            # 服饰鞋包 (4个)
            {
                "name": "优衣库 纯棉圆领T恤",
                "price": 99.00,
                "intro": "舒适透气，百搭单品",
                "description": """优衣库 纯棉圆领T恤，采用 100% 优质棉料，
舒适透气，版型合身，多色可选，是衣橱必备的百搭单品。

产品特点：
- 100% 优质棉料
- 舒适透气
- 版型合身
- 多色可选
- 易打理
""",
                "image_url": "https://picsum.photos/400/400?random=17",
                "category": "服饰鞋包",
                "stock": 500
            },
            {
                "name": "Nike Air Max 运动鞋",
                "price": 899.00,
                "intro": "经典气垫，舒适缓震",
                "description": """Nike Air Max 运动鞋，经典 Air 气垫设计，
提供出色的缓震效果，透气网面鞋面，时尚外观，运动休闲两相宜。

产品特点：
- Air 气垫缓震
- 透气网面鞋面
- 时尚外观
- 防滑大底
- 多色可选
""",
                "image_url": "https://picsum.photos/400/400?random=18",
                "category": "服饰鞋包",
                "stock": 200
            },
            {
                "name": "七匹狼 商务休闲衬衫",
                "price": 299.00,
                "intro": "免烫面料，职场必备",
                "description": """七匹狼 商务休闲衬衫，采用免烫面料，
不易褶皱，版型修身，适合职场穿着，专业得体。

产品特点：
- 免烫面料
- 不易褶皱
- 修身版型
- 舒适透气
- 职场必备
""",
                "image_url": "https://picsum.photos/400/400?random=19",
                "category": "服饰鞋包",
                "stock": 300
            },
            {
                "name": "Coach 经典款手提包",
                "price": 3999.00,
                "intro": "经典设计，品质之选",
                "description": """Coach 经典款手提包，采用优质皮革材质，
经典品牌标识，容量适中，通勤或休闲都适用，彰显品味。

产品特点：
- 优质皮革材质
- 经典品牌标识
- 容量适中
- 多背法设计
- 品质保证
""",
                "image_url": "https://picsum.photos/400/400?random=20",
                "category": "服饰鞋包",
                "stock": 80
            },

            # 美妆个护 (2个)
            {
                "name": "SK-II 神仙水",
                "price": 1590.00,
                "intro": "经典护肤精华，改善肤质",
                "description": """SK-II 神仙水，蕴含 90%+ Pitera™，
改善肤质，提亮肤色，让肌肤焕发光彩，是护肤界的经典之作。

产品特点：
- 90%+ Pitera™
- 改善肤质
- 提亮肤色
- 细致毛孔
- 经典护肤
""",
                "image_url": "https://picsum.photos/400/400?random=21",
                "category": "美妆个护",
                "stock": 150
            },
            {
                "name": "Dior 烈艳蓝金唇膏",
                "price": 350.00,
                "intro": "经典正红，显色持久",
                "description": """Dior 烈艳蓝金唇膏，#999 经典正红色，
显色持久，滋润不拔干，是化妆包中的必备单品。

产品特点：
- 经典正红色
- 显色持久
- 滋润不拔干
- 高级包装
- 多色可选
""",
                "image_url": "https://picsum.photos/400/400?random=22",
                "category": "美妆个护",
                "stock": 250
            },

            # 食品生鲜 (2个)
            {
                "name": "百草味 坚果礼盒",
                "price": 168.00,
                "intro": "多种坚果，健康美味",
                "description": """百草味 坚果礼盒，包含多种坚果：
夏威夷果、巴旦木、腰果、核桃等，新鲜美味，健康营养，
是送礼和自享的好选择。

产品特点：
- 多种坚果组合
- 新鲜美味
- 健康营养
- 精美礼盒包装
- 送礼佳品
""",
                "image_url": "https://picsum.photos/400/400?random=23",
                "category": "食品生鲜",
                "stock": 400
            },
            {
                "name": "农夫山泉 矿泉水 24瓶",
                "price": 36.00,
                "intro": "天然矿泉水，健康饮用水",
                "description": """农夫山泉 天然矿泉水，取自天然水源，
口感甘甜，富含多种矿物质，24瓶量贩装，家庭必备。

产品特点：
- 天然水源
- 口感甘甜
- 富含矿物质
- 24瓶量贩装
- 家庭必备
""",
                "image_url": "https://picsum.photos/400/400?random=24",
                "category": "食品生鲜",
                "stock": 1000
            },
        ]

        for goods_data in test_goods:
            existing = db.query(Goods).filter(Goods.name == goods_data["name"]).first()
            if not existing:
                goods = Goods(**goods_data)
                db.add(goods)
                print(f"创建商品: {goods_data['name']} ({goods_data['category']})")

        db.commit()
        print(f"\n测试数据填充完成！共 {len(test_goods)} 个商品")

    except Exception as e:
        print(f"填充数据时出错: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
