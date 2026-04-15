export interface FavoriteItem {
  favorite_id: number
  user_id: number
  goods_id: number
  goods_name?: string
  price?: number
  image_url?: string
  intro?: string
  create_time: string
}

export interface FavoriteListResponse {
  items: FavoriteItem[]
}

export interface AddFavoriteRequest {
  goods_id: number
}

export interface FavoriteCheckResponse {
  is_favorited: boolean
}

export interface FavoriteIdsResponse {
  ids: number[]
}
