import request from '@/utils/request'
import type { Goods, GoodsListResponse } from '@/types/goods'
import type { CartItem, CartListResponse, AddCartRequest, UpdateCartRequest } from '@/types/cart'
import type { Order, OrderDetail, OrderListResponse, CheckoutRequest, CartCheckoutRequest } from '@/types/order'
import type { FavoriteItem, FavoriteListResponse, AddFavoriteRequest, FavoriteCheckResponse, FavoriteIdsResponse } from '@/types/favorite'

export const shopService = {
  getGoodsList: (page = 1, size = 20, category?: string): Promise<GoodsListResponse> => {
    const params: Record<string, any> = { page, size }
    if (category) {
      params.category = category
    }
    return request.get('/api/v1/goods/list', { params })
  },

  getGoodsDetail: (goodsId: number): Promise<Goods> => {
    return request.get('/api/v1/goods/detail', { params: { goods_id: goodsId } })
  },

  getCartList: (): Promise<CartListResponse> => {
    return request.get('/api/v1/cart/list')
  },

  addToCart: (data: AddCartRequest): Promise<CartItem> => {
    return request.post('/api/v1/cart/add', data)
  },

  updateCart: (data: UpdateCartRequest): Promise<CartItem> => {
    return request.put('/api/v1/cart/update', data)
  },

  deleteCart: (cartId: number): Promise<{ success: boolean }> => {
    return request.delete('/api/v1/cart/delete', { params: { cart_id: cartId } })
  },

  checkoutDirect: (data: CheckoutRequest): Promise<Order> => {
    return request.post('/api/v1/order/checkout', data)
  },

  checkoutCart: (data: CartCheckoutRequest): Promise<Order> => {
    return request.post('/api/v1/order/checkout/cart', data)
  },

  getOrderList: (): Promise<OrderListResponse> => {
    return request.get('/api/v1/order/list')
  },

  getOrderDetail: (orderId: number): Promise<OrderDetail> => {
    return request.get('/api/v1/order/detail', { params: { order_id: orderId } })
  },

  payOrder: (orderId: number): Promise<Order> => {
    return request.post('/api/v1/order/pay', null, { params: { order_id: orderId } })
  },

  receiveOrder: (orderId: number): Promise<Order> => {
    return request.post('/api/v1/order/receive', null, { params: { order_id: orderId } })
  },

  cancelOrder: (orderId: number): Promise<Order> => {
    return request.post('/api/v1/order/cancel', null, { params: { order_id: orderId } })
  },

  addFavorite: (goodsId: number): Promise<FavoriteItem> => {
    return request.post('/api/v1/favorite/add', { goods_id: goodsId })
  },

  removeFavorite: (goodsId: number): Promise<{ success: boolean }> => {
    return request.delete('/api/v1/favorite/remove', { params: { goods_id: goodsId } })
  },

  getFavoriteList: (): Promise<FavoriteListResponse> => {
    return request.get('/api/v1/favorite/list')
  },

  checkFavorite: (goodsId: number): Promise<FavoriteCheckResponse> => {
    return request.get('/api/v1/favorite/check', { params: { goods_id: goodsId } })
  },

  getFavoriteIds: (): Promise<FavoriteIdsResponse> => {
    return request.get('/api/v1/favorite/ids')
  },
}
