import axios from 'axios'
import type {
  AdminLoginRequest,
  AuthResponse,
  OrderListResponse,
  OrderDetail,
  Order,
} from '../types'

const api = axios.create({
  baseURL: '/api/v1/admin',
  timeout: 10000,
})

// 请求拦截器：添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
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

  getOrderList: (status?: string): Promise<OrderListResponse> => {
    const params: Record<string, any> = {}
    if (status) {
      params.status = status
    }
    return api.get('/order/list', { params }).then((res) => res.data)
  },

  getOrderDetail: (orderId: number): Promise<OrderDetail> => {
    return api.get('/order/detail', { params: { order_id: orderId } }).then((res) => res.data)
  },

  shipOrder: (orderId: number): Promise<Order> => {
    return api.post('/order/ship', null, { params: { order_id: orderId } }).then((res) => res.data)
  },
}

export default api
