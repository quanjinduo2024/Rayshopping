import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import type { User, Address, AddressRequest, LoginRequest, RegisterRequest, UpdateUserRequest, UpdatePasswordRequest, UpdatePhoneRequest, UpdateAvatarRequest, AuthResponse } from '@/types/user'

export const userService = {
  login: (data: LoginRequest): Promise<AuthResponse> => {
    return request.post('/api/v1/user/login', data)
  },

  register: (data: RegisterRequest): Promise<AuthResponse> => {
    return request.post('/api/v1/user/register', data)
  },

  getUserInfo: (): Promise<User> => {
    return request.get('/api/v1/user/info')
  },

  updateUser: (data: UpdateUserRequest): Promise<User> => {
    return request.put('/api/v1/user/update', data)
  },

  // 地址相关 API（模拟，实际项目中需要后端支持）
  getAddressList: (): Promise<Address[]> => {
    return request.get('/api/v1/user/address')
  },

  addAddress: (data: AddressRequest): Promise<Address> => {
    return request.post('/api/v1/user/address', data)
  },

  updateAddress: (addressId: number, data: AddressRequest): Promise<Address> => {
    return request.put(`/api/v1/user/address/${addressId}`, data)
  },

  deleteAddress: (addressId: number): Promise<void> => {
    return request.delete(`/api/v1/user/address/${addressId}`)
  },

  setDefaultAddress: (addressId: number): Promise<void> => {
    return request.put(`/api/v1/user/address/${addressId}/default`)
  },

  // 账户安全相关 API
  updatePassword: (data: UpdatePasswordRequest): Promise<void> => {
    return request.put('/api/v1/user/password', data)
  },

  sendVerificationCode: (phone: string): Promise<void> => {
    return request.post('/api/v1/user/send-code', { phone })
  },

  updatePhone: (data: UpdatePhoneRequest): Promise<void> => {
    return request.put('/api/v1/user/phone', data)
  },

  verifyRealName: (data: any): Promise<void> => {
    return request.post('/api/v1/user/verify-realname', data)
  },

  // 头像相关 API
  uploadAvatar: (file: File): Promise<{ avatar_url: string; message: string }> => {
    const formData = new FormData()
    formData.append('file', file)

    const token = getToken()
    return axios.post('/api/v1/user/avatar/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
    }).then(res => res.data)
  },

  updateAvatar: (data: UpdateAvatarRequest): Promise<User> => {
    return request.put('/api/v1/user/avatar', data)
  },
}
