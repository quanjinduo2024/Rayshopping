# Shop Service API 文档

## 基础信息

- 服务端口: 8002
- 基础路径: /api/v1

## 接口列表

### 商品接口

#### 获取商品列表
- `GET /goods/list`
- Query: `?page=1&size=20`
- 响应: `{ items: [{ goods_id, name, price, intro, image_url, stock }], total }`

#### 获取商品详情
- `GET /goods/detail?goods_id=xxx`
- 响应: `{ goods_id, name, price, intro, image_url, stock, create_time }`

### 购物车接口

#### 添加商品到购物车
- `POST /cart/add`
- Header: `Authorization: Bearer <token>`
- 请求体: `{ goods_id, quantity }`
- 响应: `{ cart_id, user_id, goods_id, quantity, checked }`

#### 获取购物车列表
- `GET /cart/list`
- Header: `Authorization: Bearer <token>`
- 响应: `[{ cart_id, goods_id, goods_name, price, quantity, checked, image_url }]`

#### 更新购物车项
- `PUT /cart/update`
- Header: `Authorization: Bearer <token>`
- 请求体: `{ cart_id, quantity?, checked? }`
- 响应: `{ cart_id, quantity, checked }`

#### 删除购物车项
- `DELETE /cart/delete?cart_id=xxx`
- Header: `Authorization: Bearer <token>`
- 响应: `{ success: true }`

### 订单接口

#### 直接购买结算
- `POST /order/checkout`
- Header: `Authorization: Bearer <token>`
- 请求体: `{ goods_id, quantity }`
- 响应: `{ order_id, total_price, status }`

#### 购物车结算
- `POST /order/checkout/cart`
- Header: `Authorization: Bearer <token>`
- 请求体: `{ cart_ids: [] }`
- 响应: `{ order_id, total_price, status }`

#### 获取订单列表
- `GET /order/list`
- Header: `Authorization: Bearer <token>`
- 响应: `[{ order_id, total_price, status, create_time }]`

#### 获取订单详情
- `GET /order/detail?order_id=xxx`
- Header: `Authorization: Bearer <token>`
- 响应: `{ order_id, total_price, status, create_time, items: [{ goods_id, goods_name, price, quantity }] }`
