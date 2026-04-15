import request from '@/utils/request'
import type { User, Address, AddressRequest, LoginRequest, RegisterRequest, UpdateUserRequest, AuthResponse } from '@/types/user'

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
}
