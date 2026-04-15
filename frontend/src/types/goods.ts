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

export interface GoodsListResponse {
  items: Goods[]
  total: number
}
