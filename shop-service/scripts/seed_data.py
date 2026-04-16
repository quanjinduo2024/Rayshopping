"""
测试数据填充脚本 - 约500个商品
先创建24个优质商品，再批量生成约476个商品
"""
import sys
import os
import random

# 添加项目根目录到路径
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.database import SessionLocal
from app.models.goods import Goods


# ========== 24个优质商品（手动编写） ==========
PREMIUM_GOODS = [
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


# ========== 批量生成配置 ==========
CATEGORY_CONFIG = {
    "手机数码": {
        "count": 110,
        "price_min": 500,
        "price_max": 12000,
        "brands": ["Apple", "小米", "华为", "OPPO", "vivo", "三星", "荣耀", "一加", "魅族", "真我"],
        "products": [
            "iPhone", "Mate", "P", "Find", "X", "Galaxy", "数字系列", "Note",
            "耳机", "充电器", "数据线", "手机壳", "贴膜", "充电宝", "蓝牙耳机",
            "智能手表", "手环", "平板"
        ],
        "modifiers": ["Pro", "Ultra", "Max", "Lite", "标准版", "青春版", "旗舰版", "至尊版", "特别版"],
        "intro_templates": [
            "品质之选，性能强劲",
            "热销爆款，好评如潮",
            "新品上市，限时优惠",
            "旗舰配置，亲民价格",
            "轻薄便携，长续航",
            "专业级影像，记录美好",
            "强劲芯片，流畅体验"
        ]
    },
    "电脑办公": {
        "count": 90,
        "price_min": 100,
        "price_max": 20000,
        "brands": ["联想", "Dell", "HP", "华硕", "宏碁", "罗技", "雷蛇", "苹果", "微软", "ThinkPad"],
        "products": [
            "笔记本", "游戏本", "轻薄本", "台式机", "一体机",
            "机械键盘", "无线鼠标", "显示器", "摄像头", "音箱",
            "移动硬盘", "U盘", "路由器", "拓展坞", "支架"
        ],
        "modifiers": ["Air", "Pro", "Plus", "游戏版", "商务版", "学生版", "创作版"],
        "intro_templates": [
            "高效办公，轻松应对",
            "游戏利器，畅快吃鸡",
            "高清显示，色彩准确",
            "机械手感，码字神器",
            "大容量存储，快速传输",
            "轻薄便携，出差必备",
            "强劲性能，多任务处理"
        ]
    },
    "家电": {
        "count": 80,
        "price_min": 200,
        "price_max": 15000,
        "brands": ["格力", "美的", "海尔", "西门子", "索尼", "三星", "小米", "博世", "LG", "松下"],
        "products": [
            "电视", "空调", "冰箱", "洗衣机", "微波炉", "烤箱",
            "洗碗机", "吸尘器", "扫地机器人", "空气净化器",
            "热水器", "油烟机", "燃气灶", "电风扇", "电暖器"
        ],
        "modifiers": ["变频", "智能", "一级能效", "大容量", "超薄", "静音", "节能"],
        "intro_templates": [
            "一级能效，省电省心",
            "智能控制，远程操作",
            "大容量，满足全家需求",
            "静音设计，不扰生活",
            "变频技术，恒温舒适",
            "大牌品质，售后无忧",
            "时尚外观，装点家居"
        ]
    },
    "服饰鞋包": {
        "count": 65,
        "price_min": 50,
        "price_max": 5000,
        "brands": ["Nike", "Adidas", "优衣库", "李宁", "Coach", "MK", "安踏", "特步", "ZARA", "H&M"],
        "products": [
            "T恤", "衬衫", "卫衣", "外套", "羽绒服", "牛仔裤",
            "运动鞋", "休闲鞋", "帆布鞋", "靴子",
            "双肩包", "手提包", "钱包", "皮带", "帽子"
        ],
        "modifiers": ["经典款", "限量版", "新款", "联名款", "复古", "潮流", "百搭"],
        "intro_templates": [
            "经典款式，永不过时",
            "潮流新款，时尚达人必备",
            "舒适面料，亲肤透气",
            "百搭单品，衣橱必备",
            "限量发售，先到先得",
            "联名设计，独特品味",
            "高品质工艺，耐穿耐用"
        ]
    },
    "美妆个护": {
        "count": 35,
        "price_min": 50,
        "price_max": 2000,
        "brands": ["SK-II", "Dior", "兰蔻", "雅诗兰黛", "资生堂", "欧莱雅", "香奈儿", "YSL", "纪梵希", "MAC"],
        "products": [
            "精华液", "面霜", "眼霜", "爽肤水", "乳液",
            "口红", "粉底液", "散粉", "睫毛膏", "眼影",
            "洗面奶", "面膜", "防晒霜", "香水", "护手霜"
        ],
        "modifiers": ["修护", "保湿", "美白", "抗皱", "紧致", "清爽", "滋养"],
        "intro_templates": [
            "大牌品质，值得信赖",
            "深层修护，焕发光彩",
            "保湿补水，肌肤水润",
            "明星色号，显白不挑皮",
            "温和配方，敏感肌可用",
            "持久留香，魅力无限",
            "精致包装，送礼首选"
        ]
    },
    "食品生鲜": {
        "count": 25,
        "price_min": 10,
        "price_max": 500,
        "brands": ["百草味", "三只松鼠", "良品铺子", "农夫山泉", "蒙牛", "伊利", "奥利奥", "乐事", "德芙", "费列罗"],
        "products": [
            "坚果礼盒", "薯片", "饼干", "巧克力", "糖果",
            "矿泉水", "牛奶", "酸奶", "果汁", "咖啡",
            "水果干", "牛肉干", "猪肉脯", "海苔", "果冻"
        ],
        "modifiers": ["礼盒装", "量贩装", "精选", "有机", "进口", "原味", "混合口味"],
        "intro_templates": [
            "美味零食，休闲必备",
            "新鲜美味，品质保证",
            "量贩装，更实惠",
            "精选原料，口感上乘",
            "有机健康，放心食用",
            "独立包装，方便携带",
            "送礼自用两相宜"
        ]
    }
}


def generate_description(category: str, brand: str, product_name: str) -> str:
    """生成商品详细描述"""
    templates = [
        f"{brand} {product_name}，采用优质原材料，经过多道工序精制而成。产品品质卓越，深受消费者喜爱。\n\n产品特点：\n- 品质保证，放心购买\n- 性价比高，物超所值\n- 用户好评，值得信赖\n- 售后完善，购物无忧",
        f"这款{product_name}来自{brand}，无论是自用还是送礼都是不错的选择。精心设计，贴心服务，让您购物更放心。\n\n产品特点：\n- 精心设计，细节考究\n- 多色/多规格可选\n- 现货速发，快速送达\n- 7天无理由退换",
        f"{brand}匠心打造{product_name}，专注品质，只为给您更好的体验。上市以来广受好评，复购率高。\n\n产品特点：\n- 匠心品质，值得信赖\n- 热销爆款，销量领先\n- 好评如潮，口碑之选\n- 限时优惠，欲购从速"
    ]
    return random.choice(templates)


def seed_data():
    """填充测试数据"""
    db = SessionLocal()
    try:
        print("=" * 60)
        print("开始填充商品数据...")
        print("=" * 60)

        # 获取已有商品名称集合（防止重复）
        existing_goods = db.query(Goods).all()
        existing_names = {g.name for g in existing_goods}
        print(f"\n数据库中已有 {len(existing_names)} 个商品")

        total_created = 0

        # ========== 第一步：创建24个优质商品 ==========
        print(f"\n{'=' * 60}")
        print("正在创建【24个优质商品】...")
        print(f"{'=' * 60}")

        premium_created = 0
        for goods_data in PREMIUM_GOODS:
            if goods_data["name"] not in existing_names:
                goods = Goods(**goods_data)
                db.add(goods)
                existing_names.add(goods_data["name"])
                premium_created += 1
                total_created += 1
                print(f"  创建商品: {goods_data['name']}")

        db.commit()
        print(f"\n[OK] 优质商品完成：创建 {premium_created} 个\n")

        # ========== 第二步：批量生成约476个商品 ==========
        category_stats = {}

        for category, config in CATEGORY_CONFIG.items():
            print(f"\n{'=' * 60}")
            print(f"正在批量生成【{category}】商品...")
            print(f"{'=' * 60}")

            created_count = 0
            target_count = config["count"]
            attempt = 0
            max_attempts = target_count * 10

            while created_count < target_count and attempt < max_attempts:
                attempt += 1

                # 随机选择组件
                brand = random.choice(config["brands"])
                product = random.choice(config["products"])
                modifier = random.choice(config["modifiers"]) if random.random() > 0.3 else ""

                # 生成商品名称
                if modifier:
                    name = f"{brand} {product} {modifier}"
                else:
                    name = f"{brand} {product}"

                # 添加编号防止重复
                base_name = name
                suffix = 1
                while name in existing_names:
                    name = f"{base_name} ({suffix})"
                    suffix += 1

                # 生成价格
                price = round(random.uniform(config["price_min"], config["price_max"]), 2)

                # 生成简介和描述
                intro = random.choice(config["intro_templates"])
                description = generate_description(category, brand, product)

                # 生成图片URL（使用现有商品数量+新创建数量作为random参数）
                image_id = len(existing_names) + total_created + 1
                image_url = f"https://picsum.photos/400/400?random={image_id}"

                # 生成库存
                stock = random.randint(50, 500)

                # 创建商品
                goods = Goods(
                    name=name,
                    price=price,
                    intro=intro,
                    description=description,
                    image_url=image_url,
                    category=category,
                    stock=stock
                )
                db.add(goods)
                existing_names.add(name)
                created_count += 1
                total_created += 1

                if created_count % 20 == 0:
                    print(f"  已生成 {created_count}/{target_count}...")

            db.commit()
            category_stats[category] = created_count
            print(f"\n[OK] 【{category}】完成：生成 {created_count} 个商品")

        # 输出统计报告
        print("\n" + "=" * 60)
        print("商品数据填充完成！")
        print("=" * 60)
        print(f"\n原有商品数：{len(existing_goods)}")
        print(f"新增商品数：{total_created}")
        print(f"总计商品数：{len(existing_goods) + total_created}")
        print("\n分类统计：")
        print(f"  - 优质商品: {premium_created} 个")
        for category, count in category_stats.items():
            print(f"  - {category}: {count} 个")

    except Exception as e:
        print(f"\n[ERROR] 填充数据时出错: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()
