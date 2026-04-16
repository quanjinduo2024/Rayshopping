export interface Admin {
  admin_id: number
  username: string
  create_time: string
}

export interface AdminLoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  admin: Admin
}

export interface UserInfo {
  user_id: number
  username: string
  phone?: string
  avatar?: string
}

export interface OrderItem {
  item_id: number
  goods_id: number
  goods_name?: string
  quantity: number
  price: number
}

export interface OrderAddress {
  address_name?: string
  address_phone?: string
  address_province?: string
  address_city?: string
  address_district?: string
  address_detail?: string
}

export interface Order {
  order_id: number
  user_id: number
  total_price: number
  status: string
  create_time: string
  user_info?: UserInfo
  address_name?: string
  address_phone?: string
  address_province?: string
  address_city?: string
  address_district?: string
  address_detail?: string
}

export interface OrderDetail extends Order {
  items: OrderItem[]
}

export interface OrderListResponse {
  items: Order[]
}

// ==================== 商品相关类型 ====================

export interface Goods {
  goods_id: number
  name: string
  price: number
  intro?: string
  description?: string
  image_url?: string
  category?: string
  stock: number
  create_time: string
}

export interface GoodsCreate {
  name: string
  price: number
  intro?: string
  description?: string
  image_url?: string
  category?: string
  stock: number
}

export interface GoodsUpdate {
  name?: string
  price?: number
  intro?: string
  description?: string
  image_url?: string
  category?: string
  stock?: number
}

export interface GoodsListResponse {
  items: Goods[]
  total: number
}

// ==================== 统计相关类型 ====================

export interface StatsOverview {
  total_orders: number
  total_users: number
  total_goods: number
  total_sales: number
  pending_payment_count: number
  pending_shipment_count: number
  pending_receipt_count: number
  completed_count: number
}

// ==================== 用户相关类型 ====================

export interface User {
  user_id: number
  username: string
  phone?: string
  avatar?: string
  create_time: string
}

export interface UserListResponse {
  items: User[]
  total: number
}
