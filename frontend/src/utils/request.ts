import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { getToken, clearAuth } from './auth'

const request: AxiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes('/api/v1/user/login')

    if (error.response?.status === 401 && !isLoginRequest) {
      // 非登录接口的401才处理为登录过期
      clearAuth()
      message.error('登录已过期，请重新登录')
      window.location.href = '/login'
    } else {
      // 登录接口的401或其他错误，显示后端返回的具体错误信息
      const errorMessage = (error.response?.data as { detail?: string })?.detail || '请求失败'
      message.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default request
