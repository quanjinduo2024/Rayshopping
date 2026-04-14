import request from '@/utils/request'
import type { User, LoginRequest, RegisterRequest, UpdateUserRequest, AuthResponse } from '@/types/user'

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
}
