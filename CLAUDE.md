# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供仓库操作指南。

## 架构概览

Rayshopping 是一个微服务电商平台，包含四个独立组件：

```
┌─────────────────────────────────────────────────────────────┐
│                        Rayshopping                          │
├─────────────────────────────────────────────────────────────┤
│  frontend        : React + TypeScript + Vite (端口 3000)   │
│  admin-frontend  : React + TypeScript + Vite (端口 3001)   │
│  user-service    : FastAPI + SQLite (端口 8001)            │
│  shop-service    : FastAPI + SQLite (端口 8002)            │
└─────────────────────────────────────────────────────────────┘
```

### 服务职责分离

**user-service (端口 8001)**
- 管理顾客用户（User 模型）
- 顾客用户认证
- 地址管理

**shop-service (端口 8002)**
- 管理管理员（Admin 模型）
- 商品管理
- 订单管理
- 购物车管理
- 收藏管理
- 管理后台数据

**重要说明**：管理员和顾客是完全独立的实体，拥有各自独立的认证系统。没有角色字段——它们在不同的数据库/表中。

## 常用命令

### user-service
```bash
cd user-service
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload --port 8001
pytest
```

### shop-service
```bash
cd shop-service
pip install -r requirements.txt
python scripts/init_db.py
uvicorn app.main:app --reload --port 8002
pytest
```

### frontend
```bash
cd frontend
npm install
npm run dev
npm run build
npm run lint
npm run test
```

### admin-frontend
```bash
cd admin-frontend
npm install
npm run dev
npm run build
```

## 跨服务通信

shop-service 通过 HTTP 客户端调用 user-service：
- `shop-service/app/services/user_client.py`
- 基础 URL 在 `shop-service/app/config.py` 中配置（USER_SERVICE_URL）

user-service 中的内部接口（供 shop-service 调用）：
- `GET /api/v1/user/exist` - 检查用户是否存在
- `GET /api/v1/user/detail` - 获取用户详情
- `GET /api/v1/user/list` - 获取用户列表（分页）
- `GET /api/v1/user/address/detail/internal` - 获取地址详情

## 关键文件

| 路径 | 用途 |
|------|------|
| `user-service/app/api/v1/user.py` | 用户和地址 API 接口 |
| `user-service/app/services/user_service.py` | 用户业务逻辑 |
| `user-service/app/models/user.py` | 用户模型 |
| `shop-service/app/api/v1/admin.py` | 管理后台 API 接口 |
| `shop-service/app/api/v1/order.py` | 订单 API 接口 |
| `shop-service/app/services/user_client.py` | 用户服务 HTTP 客户端 |
| `shop-service/app/models/admin.py` | 管理员模型 |

## FastAPI 路由顺序注意事项

添加路由时，将更具体的路由放在参数化路由之前，以避免错误匹配。示例：
- ✅ 正确：`/address/detail/internal` 在前，`/address/{address_id}` 在后
- ❌ 错误：`/address/{address_id}` 在前，`/address/detail/internal` 在后

## 数据库

两个服务都使用 SQLite：
- `user-service/data/sqlite/user.db`
- `shop-service/data/sqlite/shop.db`

如果向模型添加新字段，可能需要：
1. 删除 .db 文件并重新初始化，或者
2. 使用 ALTER TABLE 添加新列
