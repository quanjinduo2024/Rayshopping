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

// ==================== 退换货相关类型 ====================

export interface OrderReturn {
  return_id: number
  order_id: number
  user_id: number
  type: string
  status: string
  reason: string
  images?: string
  remark?: string
  approve_remark?: string
  create_time: string
  update_time: string
}

export interface OrderReturnCreate {
  order_id: number
  type: string
  reason: string
  images?: string
  remark?: string
}

export interface OrderReturnListResponse {
  items: OrderReturn[]
  total: number
}

export interface CheckoutRequest {
  goods_id: number
  quantity: number
  address_id: number
}

export interface CartCheckoutRequest {
  cart_ids: number[]
  address_id: number
}
