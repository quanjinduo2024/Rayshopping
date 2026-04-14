Rayshopping 购物平台 · PRD.md（企业级标准版）

1. 项目概述
   1.1 项目名称
   Rayshopping 基于微服务的简易购物平台
   1.2 项目背景
   本项目构建一个前后端分离、微服务架构、可演示、功能完整的在线购物系统。采用 React + Ant Design 前端与 FastAPI 微服务后端架构，满足教学演示与企业级项目结构双要求。

1.3 项目目标

- 实现用户模块 + 购物模块两大核心业务域
- 采用微服务拆分，服务间通过 HTTP 通信
- 前端使用 React + Ant Design 构建现代化 UI
- 集成商品智能推荐 AI 功能
- 支持本地 Windows 环境快速部署与演示
- 遵循企业级规范（PRD、接口文档、代码规范、部署文档）
  1.4 开发模式
- 组内 双人协作
- 按 业务模块分工：
  - 成员A：用户模块（前端 + 后端）
  - 成员B：购物模块（前端 + 后端 + AI 推荐（可延后设计））
- 代码仓库：research
- 个人分支：ai_msa_qjd
- AI 辅助：Claude Code + Doubao-Seed-2.0-Code

---

2. 需求范围与范围边界
   2.1 核心功能需求
   2.1.1 用户模块

- 用户注册（账号密码 + 基本信息）
- 用户登录（JWT 鉴权）
- 用户信息查询 / 修改
- 用户删除（管理员功能，可选）
- 提供用户信息校验接口，供购物服务调用
  2.1.2 购物模块
- 商品列表展示（图片、名称、价格、简介）
- 购物车管理（添加、删除、修改数量、勾选）
- 结算流程（直接购买 / 购物车结算）
- 订单创建（库存扣减、金额计算）
- 订单管理（历史订单查询、订单详情）
  2.2 AI 功能需求（明确限定）
- 仅实现：商品智能推荐
- 基于用户历史订单 / 购物行为
- 本地轻量算法，不依赖第三方 API
- 商城首页展示“猜你喜欢”区域
  2.3 非功能需求
- 服务间通信：HTTP + JSON
- 前后端分离
- 项目结构清晰，可扩展
- 代码规范（PEP8 + React/ESLint）
- 演示流程可复现：环境初始化 → 拉取代码 → 启动 → 演示
  2.4 范围不做
- 不做支付（仅模拟结算）
- 不做权限系统（仅登录鉴权）
- 不做复杂 AI（仅商品推荐）
- 不部署 Docker（前期纯本地 Windows 运行）

---

3. 方案设计
   3.1 系统架构
   整体架构图（企业级风格）
   客户端
   ↓
   前端 React + Ant Design（端口 3000）
   ↓ HTTP

---

↓ ↓
用户微服务 user-service (8001) 购物微服务 shop-service (8002)
（用户CRUD + 鉴权） （商品/购物车/订单/AI推荐）
↓
HTTP 调用用户服务校验用户
3.2 模块结构
3.2.1 前端模块

- 用户模块页面：登录、注册、个人中心
- 商城页面：商品列表、商品详情
- 购物车页面：查看、修改、勾选
- 结算页面：确认订单、提交订单
- 订单页面：历史订单、订单详情
- 推荐区：商品智能推荐
  3.2.2 后端模块
- user-service
  - 用户注册/登录/查询/修改/删除
  - 提供 HTTP 接口供 shop-service 调用
- shop-service
  - 商品管理
  - 购物车
  - 结算、订单
  - AI 推荐核心逻辑
    3.3 数据库设计
    仅采用 SQLite（本地零配置）

用户表 User

- user_id (PK)
- username
- password
- phone
- create_time
  商品表 Goods
- goods_id (PK)
- name
- price
- intro
- image_url
- stock
- create_time
  购物车表 Cart
- cart_id (PK)
- user_id
- goods_id
- quantity
- checked
  订单表 Order
- order_id (PK)
- user_id
- total_price
- status
- create_time
  订单商品表 OrderItem
- item_id (PK)
- order_id
- goods_id
- quantity
- price

---

4. 技术选型（企业级标准）
   4.1 前端技术栈

- 框架：React 18
- UI 组件库：Ant Design 5
- 路由：React Router 6
- HTTP 客户端：Axios
- 构建工具：Vite（Windows 完美支持）
- 代码规范：ESLint + Prettier
  4.2 后端技术栈
- 语言：Python 3.9
- Web 框架：FastAPI
- 服务器：Uvicorn
- 数据库：SQLite3
- 接口风格：RESTful
- 服务通信：HTTP + JSON
  4.3 AI 技术栈
- 商品推荐：
  - 基于用户历史订单
  - 简单协同过滤 + 物品相似度
- 本地纯 Python 实现
- 无第三方依赖
  4.4 开发与协作
- 版本控制：Git
- 分支规范：个人分支 ai_msa_xxx
- AI 辅助开发：Claude Code + Doubao-Seed-2.0-Code
- 运行环境：Windows 本地前期测试，后续可迁移至 CentOS 7 虚拟机

---

5. 接口设计（核心）
   5.1 用户微服务（user-service 端口 8001）

- POST /user/register
- POST /user/login
- GET /user/info
- PUT /user/update
- DELETE /user/delete
- GET /user/exist?user_id=xxx （供 shop-service 校验）
  5.2 购物微服务（shop-service 端口 8002）
  商品接口
- GET /goods/list
- GET /goods/detail
  购物车接口
- POST /cart/add
- GET /cart/list
- PUT /cart/update
- DELETE /cart/delete
  结算接口
- POST /order/checkout（直接购买）
- POST /order/checkout/cart（购物车结算）
  订单接口
- GET /order/list
- GET /order/detail
  推荐接口
- GET /goods/recommend?user_id=xxx

---

6. AI 商品推荐方案（明确限定版）
   6.1 推荐逻辑

- 采集用户历史订单中的商品 ID
- 计算商品相似度（共现频率 + 简单余弦）
- 给用户推荐 TopN 商品
  6.2 实现方式
- 本地 Python 算法模块
- 不依赖外部模型 / API
- 性能满足课程演示需求

---

7. 部署与运行
   7.1 前期（Windows）

- 前端：npm install → npm run dev
- 后端：两个 uvicorn 分别启动
- 端口：3000 / 8001 / 8002
  7.2 可迁移至 CentOS 7
- 保留现有结构
- 保证路径与端口不变
- 可直接在虚拟机运行
