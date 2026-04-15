export interface User {
  user_id: number
  username: string
  phone?: string
  create_time: string
}

export interface Address {
  address_id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default: boolean
  create_time: string
}

export interface AddressRequest {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  is_default?: boolean
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  phone?: string
}

export interface UpdateUserRequest {
  phone?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user_id: number
}
