import request from '@/utils/request'
import type { Goods, GoodsListResponse } from '@/types/goods'
import type { CartItem, CartListResponse, AddCartRequest, UpdateCartRequest } from '@/types/cart'
import type { Order, OrderDetail, OrderListResponse, CheckoutRequest, CartCheckoutRequest } from '@/types/order'

export const shopService = {
  getGoodsList: (page = 1, size = 20): Promise<GoodsListResponse> => {
    return request.get('/api/v1/goods/list', { params: { page, size } })
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
}
