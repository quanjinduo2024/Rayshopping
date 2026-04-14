export interface CartItem {
  cart_id: number
  user_id: number
  goods_id: number
  goods_name?: string
  price?: number
  image_url?: string
  quantity: number
  checked: boolean
}

export interface CartListResponse {
  items: CartItem[]
}

export interface AddCartRequest {
  goods_id: number
  quantity: number
}

export interface UpdateCartRequest {
  cart_id: number
  quantity?: number
  checked?: boolean
}
