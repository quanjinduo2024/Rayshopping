# Rayshopping 购物平台

基于微服务架构的简易购物平台，采用 React + Ant Design 前端与 FastAPI 微服务后端架构。

## 项目结构

```
Rayshopping/
├── frontend/          # React + TypeScript + Vite 前端
├── user-service/      # FastAPI 用户服务 (端口 8001)
├── shop-service/      # FastAPI 购物服务 (端口 8002)
├── docs/              # 项目文档
└── prd.md             # 产品需求文档
```

## 快速开始

### 前置要求

- Python 3.9+
- Node.js 18+
- npm 或 yarn

### 启动后端服务

#### 1. 启动 user-service (端口 8001)

```bash
cd user-service

# 创建虚拟环境（可选）
python -m venv venv
# Windows 激活: venv\Scripts\activate
# Linux/Mac 激活: source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境配置
copy .env.example .env

# 初始化数据库
python scripts/init_db.py

# 启动服务
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

#### 2. 启动 shop-service (端口 8002)

```bash
cd shop-service

# 创建虚拟环境（可选）
python -m venv venv
# Windows 激活: venv\Scripts\activate
# Linux/Mac 激活: source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境配置
copy .env.example .env

# 初始化数据库
python scripts/init_db.py

# 启动服务
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

### 启动前端服务 (端口 3000)

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 访问应用

- 前端: http://localhost:3000
- user-service API 文档: http://localhost:8001/docs
- shop-service API 文档: http://localhost:8002/docs

## 技术栈

- 前端: React 18 + Ant Design 5 + Vite + TypeScript
- 后端: Python 3.9 + FastAPI + SQLite
- 认证: JWT

## 开发规范

- Git 提交信息使用中文
- 测试左移：先写测试用例，再实现功能
- 单元测试覆盖率不低于 80%
- 分支策略：main → develop → feature/*
