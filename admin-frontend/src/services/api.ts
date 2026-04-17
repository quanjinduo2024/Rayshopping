import axios from 'axios'
import type {
  AdminLoginRequest,
  AuthResponse,
  OrderListResponse,
  OrderDetail,
  Order,
  GoodsListResponse,
  Goods,
  GoodsCreate,
  GoodsUpdate,
  StatsOverview,
  UserListResponse,
  User,
  OrderReturn,
  OrderReturnListResponse,
  OrderReturnApprove,
} from '../types'

const api = axios.create({
  baseURL: '/api/v1/admin',
  timeout: 10000,
})

// 请求拦截器：添加 token（登录接口除外）
api.interceptors.request.use(
  (config) => {
    // 登录接口不需要添加 token
    if (!config.url?.includes('/auth/login')) {
      const token = localStorage.getItem('admin_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器：处理 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_info')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const adminService = {
  login: (data: AdminLoginRequest): Promise<AuthResponse> => {
    return api.post('/auth/login', data).then((res) => res.data)
  },

  logout: (): Promise<{ message: string }> => {
    return api.post('/auth/logout').then((res) => res.data)
  },

  getOrderList: (status?: string, user_id?: number): Promise<OrderListResponse> => {
    const params: Record<string, any> = {}
    if (status) {
      params.status = status
    }
    if (user_id) {
      params.user_id = user_id
    }
    return api.get('/order/list', { params }).then((res) => res.data)
  },

  getOrderDetail: (orderId: number): Promise<OrderDetail> => {
    return api.get('/order/detail', { params: { order_id: orderId } }).then((res) => res.data)
  },

  shipOrder: (orderId: number): Promise<Order> => {
    return api.post('/order/ship', null, { params: { order_id: orderId } }).then((res) => res.data)
  },

  // ==================== 商品管理 ====================

  getGoodsList: (page: number = 1, size: number = 20, search?: string): Promise<GoodsListResponse> => {
    const params: Record<string, any> = { page, size }
    if (search) {
      params.search = search
    }
    return api.get('/goods/list', { params }).then((res) => res.data)
  },

  getGoodsDetail: (goodsId: number): Promise<Goods> => {
    return api.get('/goods/detail', { params: { goods_id: goodsId } }).then((res) => res.data)
  },

  createGoods: (data: GoodsCreate): Promise<Goods> => {
    return api.post('/goods/create', data).then((res) => res.data)
  },

  updateGoods: (goodsId: number, data: GoodsUpdate): Promise<Goods> => {
    return api.put('/goods/update', data, { params: { goods_id: goodsId } }).then((res) => res.data)
  },

  deleteGoods: (goodsId: number): Promise<{ message: string }> => {
    return api.delete('/goods/delete', { params: { goods_id: goodsId } }).then((res) => res.data)
  },

  // ==================== 统计 ====================

  getStatsOverview: (): Promise<StatsOverview> => {
    return api.get('/stats/overview').then((res) => res.data)
  },

  // ==================== 用户管理 ====================

  getUserList: (page: number = 1, size: number = 20): Promise<UserListResponse> => {
    return api.get('/user/list', { params: { page, size } }).then((res) => res.data)
  },

  getUserDetail: (userId: number): Promise<User> => {
    return api.get('/user/detail', { params: { user_id: userId } }).then((res) => res.data)
  },

  // ==================== 退换货管理 ====================

  getReturnList: (status?: string, user_id?: number, page: number = 1, size: number = 20): Promise<OrderReturnListResponse> => {
    const params: Record<string, any> = { page, size }
    if (status) params.status = status
    if (user_id) params.user_id = user_id
    return api.get('/return/list', { params }).then((res) => res.data)
  },

  getReturnDetail: (returnId: number): Promise<OrderReturn> => {
    return api.get('/return/detail', { params: { return_id: returnId } }).then((res) => res.data)
  },

  approveReturn: (returnId: number, approve: boolean, approve_remark?: string): Promise<OrderReturn> => {
    return api.post('/return/approve', { approve, approve_remark }, { params: { return_id: returnId } }).then((res) => res.data)
  },

  completeReturn: (returnId: number): Promise<OrderReturn> => {
    return api.post('/return/complete', null, { params: { return_id: returnId } }).then((res) => res.data)
  },
}

export default api
