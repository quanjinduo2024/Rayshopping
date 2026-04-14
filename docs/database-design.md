# 数据库设计文档

## 用户表 (User) - user-service

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| user_id | INTEGER | 用户ID | PRIMARY KEY, AUTOINCREMENT |
| username | VARCHAR(50) | 用户名 | UNIQUE, NOT NULL |
| password | VARCHAR(255) | 密码哈希 | NOT NULL |
| phone | VARCHAR(20) | 手机号 | |
| create_time | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

## 商品表 (Goods) - shop-service

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| goods_id | INTEGER | 商品ID | PRIMARY KEY, AUTOINCREMENT |
| name | VARCHAR(100) | 商品名称 | NOT NULL |
| price | DECIMAL(10,2) | 价格 | NOT NULL |
| intro | TEXT | 商品简介 | |
| image_url | VARCHAR(255) | 图片URL | |
| stock | INTEGER | 库存 | DEFAULT 0 |
| create_time | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

## 购物车表 (Cart) - shop-service

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| cart_id | INTEGER | 购物车项ID | PRIMARY KEY, AUTOINCREMENT |
| user_id | INTEGER | 用户ID | NOT NULL |
| goods_id | INTEGER | 商品ID | NOT NULL |
| quantity | INTEGER | 数量 | DEFAULT 1 |
| checked | BOOLEAN | 是否勾选 | DEFAULT 1 |

## 订单表 (Order) - shop-service

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| order_id | INTEGER | 订单ID | PRIMARY KEY, AUTOINCREMENT |
| user_id | INTEGER | 用户ID | NOT NULL |
| total_price | DECIMAL(10,2) | 总价 | NOT NULL |
| status | VARCHAR(20) | 状态 | DEFAULT 'pending' |
| create_time | DATETIME | 创建时间 | DEFAULT CURRENT_TIMESTAMP |

## 订单商品表 (OrderItem) - shop-service

| 字段 | 类型 | 说明 | 约束 |
|------|------|------|------|
| item_id | INTEGER | 项ID | PRIMARY KEY, AUTOINCREMENT |
| order_id | INTEGER | 订单ID | NOT NULL |
| goods_id | INTEGER | 商品ID | NOT NULL |
| quantity | INTEGER | 数量 | NOT NULL |
| price | DECIMAL(10,2) | 当时价格 | NOT NULL |
