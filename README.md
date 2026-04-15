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

## 本地开发配置（多人协作）

如果团队成员在不同电脑上分别运行微服务，需要进行以下配置：

### 1. 统一 SECRET_KEY

确保所有服务的 `.env` 文件中的 `SECRET_KEY` 完全一致：

```env
SECRET_KEY=your-secret-key-change-in-production-at-least-32-chars
```

### 2. 配置服务绑定地址

每个服务都需要绑定到 `0.0.0.0` 而不是 `localhost`，这样其他电脑才能访问：

```env
HOST=0.0.0.0
```

### 3. 配置跨服务调用地址

在 shop-service 的 `.env` 中配置 user-service 的地址（运行 user-service 的电脑的IP）：

```env
USER_SERVICE_URL=http://<组员A的IP>:8001
```

### 4. 配置前端代理

在 `frontend/vite.config.ts` 中配置各服务的代理地址：

```typescript
server: {
  port: 3000,
  proxy: {
    '/api/v1/user': {
      target: 'http://<user-service的IP>:8001',
      changeOrigin: true,
    },
    '/api/v1': {
      target: 'http://<shop-service的IP>:8002',
      changeOrigin: true,
    },
  },
}
```

**注意**：`vite.config.ts` 的本地配置不要提交到 git，团队成员各自在本地修改。

### 5. 防火墙设置

确保各电脑的防火墙开放了相应端口（8001、8002）。

## 技术栈

- 前端: React 18 + Ant Design 5 + Vite + TypeScript
- 后端: Python 3.9 + FastAPI + SQLite
- 认证: JWT

## 开发规范

- Git 提交信息使用中文
- 测试左移：先写测试用例，再实现功能
- 单元测试覆盖率不低于 80%
- 分支策略：main → develop → feature/*
- 本地配置（`.env`、`vite.config.ts`）不要提交到 git
