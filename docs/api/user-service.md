# User Service API 文档

## 基础信息

- 服务端口: 8001
- 基础路径: /api/v1

## 接口列表

### 用户注册
- `POST /user/register`
- 请求体: `{ username, password, phone }`
- 响应: `{ access_token, token_type, user_id }`

### 用户登录
- `POST /user/login`
- 请求体: `{ username, password }`
- 响应: `{ access_token, token_type, user_id }`

### 获取用户信息
- `GET /user/info`
- Header: `Authorization: Bearer <token>`
- 响应: `{ user_id, username, phone, create_time }`

### 更新用户信息
- `PUT /user/update`
- Header: `Authorization: Bearer <token>`
- 请求体: `{ phone? }`
- 响应: `{ user_id, username, phone }`

### 校验用户是否存在（内部接口）
- `GET /user/exist?user_id=xxx`
- 响应: `{ exists: true/false }`
