export interface OrderItem {
  item_id: number
  goods_id: number
  goods_name?: string
  quantity: number
  price: number
}

export interface Order {
  order_id: number
  user_id: number
  total_price: number
  status: string
  create_time: string
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
}

export interface CartCheckoutRequest {
  cart_ids: number[]
}
