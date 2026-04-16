import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { User, LoginRequest, RegisterRequest, AuthResponse } from '@/types/user'
import { userService } from '@/services/userService'
import { setToken, setUserId, clearAuth, getToken, getUserId } from '@/utils/auth'

interface UserState {
  user: User | null
  token: string | null
  userId: number | null
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  user: null,
  token: getToken(),
  userId: getUserId(),
  loading: false,
  error: null,
}

export const login = createAsyncThunk<AuthResponse, LoginRequest>(
  'user/login',
  async (data) => {
    return await userService.login(data)
  }
)

export const register = createAsyncThunk<AuthResponse, RegisterRequest>(
  'user/register',
  async (data) => {
    return await userService.register(data)
  }
)

export const fetchUserInfo = createAsyncThunk<User, void>(
  'user/fetchUserInfo',
  async () => {
    return await userService.getUserInfo()
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.userId = null
      clearAuth()
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.token = action.payload.access_token
        state.userId = action.payload.user_id
        setToken(action.payload.access_token)
        setUserId(action.payload.user_id)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        // 错误消息已在 request.ts 中显示，这里不再设置
        state.error = null
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false
        state.token = action.payload.access_token
        state.userId = action.payload.user_id
        setToken(action.payload.access_token)
        setUserId(action.payload.user_id)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '注册失败'
      })
      // Fetch user info
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取用户信息失败'
      })
  },
})

export const { logout, clearError } = userSlice.actions
export default userSlice.reducer
