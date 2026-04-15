import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '@/services/userService'
import request from '@/utils/request'

vi.mock('@/utils/request', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  }
}))

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('login', () => {
    it('should call login API with correct data', async () => {
      const loginData = { username: 'testuser', password: 'testpass123' }
      const mockResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user_id: 1
      }

      vi.mocked(request.post).mockResolvedValueOnce(mockResponse)

      const result = await userService.login(loginData)

      expect(request.post).toHaveBeenCalledWith('/api/v1/user/login', loginData)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when login fails', async () => {
      const loginData = { username: 'testuser', password: 'wrongpass' }
      const mockError = new Error('Login failed')

      vi.mocked(request.post).mockRejectedValueOnce(mockError)

      await expect(userService.login(loginData)).rejects.toThrow('Login failed')
    })
  })

  describe('register', () => {
    it('should call register API with correct data', async () => {
      const registerData = {
        username: 'newuser',
        password: 'newpass123',
        phone: '13800138000'
      }
      const mockResponse = {
        access_token: 'mock-token',
        token_type: 'bearer',
        user_id: 2
      }

      vi.mocked(request.post).mockResolvedValueOnce(mockResponse)

      const result = await userService.register(registerData)

      expect(request.post).toHaveBeenCalledWith('/api/v1/user/register', registerData)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getUserInfo', () => {
    it('should call getUserInfo API', async () => {
      const mockUser = {
        user_id: 1,
        username: 'testuser',
        phone: '13800138000',
        create_time: '2024-01-01T00:00:00Z'
      }

      vi.mocked(request.get).mockResolvedValueOnce(mockUser)

      const result = await userService.getUserInfo()

      expect(request.get).toHaveBeenCalledWith('/api/v1/user/info')
      expect(result).toEqual(mockUser)
    })
  })

  describe('updateUser', () => {
    it('should call updateUser API with correct data', async () => {
      const updateData = { phone: '13911111111' }
      const mockResponse = {
        user_id: 1,
        username: 'testuser',
        phone: '13911111111',
        create_time: '2024-01-01T00:00:00Z'
      }

      vi.mocked(request.put).mockResolvedValueOnce(mockResponse)

      const result = await userService.updateUser(updateData)

      expect(request.put).toHaveBeenCalledWith('/api/v1/user/update', updateData)
      expect(result).toEqual(mockResponse)
    })
  })
})
