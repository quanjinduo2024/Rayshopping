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
