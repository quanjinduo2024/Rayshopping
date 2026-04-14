export interface Goods {
  goods_id: number
  name: string
  price: number
  intro?: string
  image_url?: string
  stock: number
  create_time: string
}

export interface GoodsListResponse {
  items: Goods[]
  total: number
}
