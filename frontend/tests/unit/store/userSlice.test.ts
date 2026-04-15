import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configureStore } from '@reduxjs/toolkit'
import userReducer, {
  login,
  register,
  fetchUserInfo,
  logout,
  clearError,
} from '@/store/userSlice'
import { userService } from '@/services/userService'

vi.mock('@/services/userService', () => ({
  userService: {
    login: vi.fn(),
    register: vi.fn(),
    getUserInfo: vi.fn(),
  }
}))

vi.mock('@/utils/auth', () => ({
  setToken: vi.fn(),
  setUserId: vi.fn(),
  clearAuth: vi.fn(),
  getToken: vi.fn(() => null),
  getUserId: vi.fn(() => null),
}))

describe('userSlice', () => {
  let store: any

  beforeEach(() => {
    vi.clearAllMocks()
    store = configureStore({
      reducer: {
        user: userReducer,
      },
    })
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = store.getState().user
      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.userId).toBeNull()
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('reducers', () => {
    it('should handle logout', () => {
      store = configureStore({
        reducer: { user: userReducer },
        preloadedState: {
          user: {
            user: { user_id: 1, username: 'test', create_time: '2024-01-01' },
            token: 'test-token',
            userId: 1,
            loading: false,
            error: null,
          }
        }
      })

      store.dispatch(logout())
      const state = store.getState().user

      expect(state.user).toBeNull()
      expect(state.token).toBeNull()
      expect(state.userId).toBeNull()
    })

    it('should handle clearError', () => {
      store = configureStore({
        reducer: { user: userReducer },
        preloadedState: {
          user: {
            user: null,
            token: null,
            userId: null,
            loading: false,
            error: 'Some error',
          }
        }
      })

      store.dispatch(clearError())
      const state = store.getState().user

      expect(state.error).toBeNull()
    })
  })

  describe('async thunks', () => {
    describe('login', () => {
      it('should handle login pending state', async () => {
        const loginData = { username: 'testuser', password: 'testpass123' }
        vi.mocked(userService.login).mockReturnValue(new Promise(() => {}))

        store.dispatch(login(loginData))
        const state = store.getState().user

        expect(state.loading).toBe(true)
        expect(state.error).toBeNull()
      })

      it('should handle login fulfilled state', async () => {
        const loginData = { username: 'testuser', password: 'testpass123' }
        const mockResponse = {
          access_token: 'test-token',
          token_type: 'bearer',
          user_id: 1,
        }
        vi.mocked(userService.login).mockResolvedValueOnce(mockResponse)

        await store.dispatch(login(loginData))
        const state = store.getState().user

        expect(state.loading).toBe(false)
        expect(state.token).toBe('test-token')
        expect(state.userId).toBe(1)
      })

      it('should handle login rejected state', async () => {
        const loginData = { username: 'testuser', password: 'wrongpass' }
        vi.mocked(userService.login).mockRejectedValueOnce(new Error('Login failed'))

        await store.dispatch(login(loginData))
        const state = store.getState().user

        expect(state.loading).toBe(false)
        expect(state.error).toContain('Login failed')
      })
    })

    describe('register', () => {
      it('should handle register fulfilled state', async () => {
        const registerData = { username: 'newuser', password: 'newpass123' }
        const mockResponse = {
          access_token: 'new-token',
          token_type: 'bearer',
          user_id: 2,
        }
        vi.mocked(userService.register).mockResolvedValueOnce(mockResponse)

        await store.dispatch(register(registerData))
        const state = store.getState().user

        expect(state.loading).toBe(false)
        expect(state.token).toBe('new-token')
        expect(state.userId).toBe(2)
      })
    })

    describe('fetchUserInfo', () => {
      it('should handle fetchUserInfo fulfilled state', async () => {
        const mockUser = {
          user_id: 1,
          username: 'testuser',
          phone: '13800138000',
          create_time: '2024-01-01T00:00:00Z',
        }
        vi.mocked(userService.getUserInfo).mockResolvedValueOnce(mockUser)

        await store.dispatch(fetchUserInfo())
        const state = store.getState().user

        expect(state.loading).toBe(false)
        expect(state.user).toEqual(mockUser)
      })
    })
  })
})
