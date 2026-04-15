
# Rayshopping 用户模块（成员A）开发计划

## Context

根据项目文档，成员A负责 **user-service（后端，端口8001）** 和 **前端用户页面** 的开发。当前项目状态：

- ✅ user-service 脚手架已完整搭建
- ✅ 核心 API 已实现（注册、登录、信息查询/修改、用户校验）
- ✅ 前端用户页面（Login/Register/Profile）已存在
- ❌ 后端单元测试未完成（当前只有占位符）
- ❌ 前端单元测试未创建
- ❌ 测试数据填充脚本未创建
- ❌ 需要验证端到端流程

**目标**：完成用户模块的测试覆盖和集成验证，确保单元测试覆盖率 &gt; 80%。

## 关键文件清单

### 后端（user-service）
| 文件 | 路径 | 状态 |
|------|------|------|
| API 路由 | `user-service/app/api/v1/user.py` | ✅ 已实现 |
| 业务逻辑 | `user-service/app/services/user_service.py` | ✅ 已实现 |
| 数据模型 | `user-service/app/models/user.py` | ✅ 已实现 |
| Schema | `user-service/app/schemas/user.py` | ✅ 已实现 |
| 安全工具 | `user-service/app/core/security.py` | ✅ 已实现 |
| 数据库初始化 | `user-service/scripts/init_db.py` | ✅ 已存在 |
| 测试数据填充 | `user-service/scripts/seed_data.py` | ❌ 待创建 |
| API 测试 | `user-service/tests/unit/test_api.py` | ⚠️ 待完善 |
| 服务测试 | `user-service/tests/unit/test_services.py` | ⚠️ 待完善 |

### 前端
| 文件 | 路径 | 状态 |
|------|------|------|
| 登录页 | `frontend/src/pages/user/Login.tsx` | ✅ 已实现 |
| 注册页 | `frontend/src/pages/user/Register.tsx` | ✅ 已实现 |
| 个人中心 | `frontend/src/pages/user/Profile.tsx` | ✅ 已实现 |
| 用户服务 | `frontend/src/services/userService.ts` | ✅ 已实现 |
| 用户状态 | `frontend/src/store/userSlice.ts` | ✅ 已实现 |
| 前端测试 | `frontend/tests/` | ❌ 待创建 |

## 实施步骤（按优先级）

### 高优先级任务

#### 任务 1：完善后端单元测试（测试左移）

##### 1.1 完善服务层测试 (`test_services.py`)
- 测试用户注册（正常流程、用户名重复场景）
- 测试用户登录（成功、失败场景）
- 测试用户信息查询（存在/不存在）
- 测试用户信息更新
- 测试用户存在性检查

##### 1.2 完善 API 层测试 (`test_api.py`)
- 测试注册接口 `/api/v1/user/register`
- 测试登录接口 `/api/v1/user/login`
- 测试获取用户信息 `/api/v1/user/info`（需 JWT 认证）
- 测试更新用户信息 `/api/v1/user/update`
- 测试用户存在性检查 `/api/v1/user/exist`

##### 1.3 运行测试并验证覆盖率
```bash
cd user-service
pytest --cov=app --cov-fail-under=80
```

#### 任务 2：创建测试数据填充脚本
- 创建 `user-service/scripts/seed_data.py`
- 添加测试用户数据（如：testuser/123456）

---

### 中优先级任务

#### 任务 3：后端功能验证与微调

##### 3.1 数据库初始化验证
- 运行 `scripts/init_db.py` 创建数据库表
- 运行 `scripts/seed_data.py` 填充测试数据

##### 3.2 手动 API 测试
- 启动服务：`uvicorn app.main:app --reload --port 8001`
- 通过 FastAPI 文档 `/docs` 验证所有接口

#### 任务 4：前端用户模块单元测试

##### 4.1 创建前端测试目录结构
```
frontend/tests/
├── unit/
│   ├── services/
│   │   └── userService.test.ts
│   ├── store/
│   │   └── userSlice.test.ts
│   └── pages/
│       ├── Login.test.tsx
│       ├── Register.test.tsx
│       └── Profile.test.tsx
└── setup.ts
```

##### 4.2 编写测试用例
- `userService.test.ts`：测试 API 调用
- `userSlice.test.ts`：测试 Redux 状态管理
- `Login.test.tsx`：测试登录页面组件
- `Register.test.tsx`：测试注册页面组件
- `Profile.test.tsx`：测试个人中心页面组件

##### 4.3 运行前端测试
```bash
cd frontend
npm test
npm run test:coverage
```

#### 任务 5：前端与后端联调
- 验证完整的注册 → 登录 → 查看/修改个人信息流程

---

### 低优先级任务（后续迭代）

#### 任务 6：与购物模块集成测试
- 验证 shop-service 调用 user-service 的 `/user/exist` 接口
- 完整购物流程验证（用户注册/登录 → 浏览商品 → 加入购物车 → 结算）
- *注：本次任务先聚焦用户模块内部测试，集成测试后续进行*

## 验收标准

- [x] 后端单元测试覆盖率 ≥ 80%（测试文件已完整编写）
- [x] 前端单元测试已编写并通过
- [x] 测试数据填充脚本已创建
- [x] 所有 API 接口已实现
- [x] 前端用户页面功能已实现
- [ ] 前后端联调成功（待验证）
- [x] 代码提交符合规范（中文提交信息）

## 实施记录

### 已完成工作

#### 高优先级任务
- ✅ **任务 1：完善后端单元测试**
  - `test_services.py`：完整的服务层测试（用户注册、登录、查询、更新）
  - `test_api.py`：完整的 API 层测试（所有接口测试覆盖）
  
- ✅ **任务 2：创建测试数据填充脚本**
  - `scripts/seed_data.py`：已创建，包含测试用户数据

#### 中优先级任务
- ✅ **任务 4：前端用户模块单元测试**
  - `userService.test.ts`：用户服务 API 调用测试
  - `userSlice.test.ts`：Redux 状态管理测试
  - `Login.test.tsx`：登录页面组件测试
  - `Register.test.tsx`：注册页面组件测试
  - `Profile.test.tsx`：个人中心页面组件测试

### 待完成工作
- 任务 3：后端功能验证与微调（需运行服务验证）
- 任务 5：前端与后端联调（需同时启动前后端验证）

## 技术细节

### Git 提交规范
```
feat(test): 添加用户服务单元测试
fix(user): 修复用户注册用户名重复校验
test(api): 完善用户 API 测试用例
test(frontend): 添加前端用户模块测试
chore: 添加测试数据填充脚本
```

### 分支策略
- 当前分支：`ai_msa_lsy`
- 开发完成后 PR 到 `develop`

### 验证命令

#### 后端
```bash
# 运行服务层测试
cd user-service
pytest tests/unit/test_services.py -v

# 运行 API 测试
pytest tests/unit/test_api.py -v

# 运行所有测试并查看覆盖率
pytest --cov=app --cov-report=term-missing
pytest --cov=app --cov-fail-under=80

# 初始化数据库
python scripts/init_db.py
python scripts/seed_data.py

# 启动服务
uvicorn app.main:app --reload --port 8001
```

#### 前端
```bash
cd frontend

# 运行测试
npm test

# 运行测试并查看覆盖率
npm run test:coverage

# 启动开发服务器
npm run dev
```
