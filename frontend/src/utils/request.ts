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
    if (error.response?.status === 401) {
      clearAuth()
      message.error('登录已过期，请重新登录')
      window.location.href = '/login'
    } else {
      const errorMessage = (error.response?.data as { detail?: string })?.detail || '请求失败'
      message.error(errorMessage)
    }
    return Promise.reject(error)
  }
)

export default request
