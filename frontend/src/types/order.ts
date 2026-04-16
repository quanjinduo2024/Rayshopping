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

export interface CheckoutRequest {
  goods_id: number
  quantity: number
  address_id: number
}

export interface CartCheckoutRequest {
  cart_ids: number[]
  address_id: number
}
