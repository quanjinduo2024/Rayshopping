import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import Profile from '@/pages/user/Profile'
import userReducer from '@/store/userSlice'
import { userService } from '@/services/userService'

// Mock userService
vi.mock('@/services/userService', () => ({
  userService: {
    updateUser: vi.fn(),
  },
}))

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }
})

const mockUser = {
  user_id: 1,
  username: 'testuser',
  phone: '13800138000',
  create_time: '2024-01-01T00:00:00Z',
}

const renderWithProviders = (ui: React.ReactElement, preloadedState = {}) => {
  const store = configureStore({
    reducer: { user: userReducer },
    preloadedState: { user: preloadedState as any },
  })
  return render(
    <Provider store={store}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>
  )
}

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render profile page with user information when user exists', () => {
    renderWithProviders(<Profile />, {
      user: mockUser,
      userId: 1,
      token: 'test-token',
      loading: false,
      error: null,
    })

    expect(screen.getByText('个人中心')).toBeInTheDocument()
    expect(screen.getByText('用户ID')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('用户名')).toBeInTheDocument()
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('手机号')).toBeInTheDocument()
    expect(screen.getByText('13800138000')).toBeInTheDocument()
    expect(screen.getByText('注册时间')).toBeInTheDocument()
  })

  it('should render form with disabled username input', () => {
    renderWithProviders(<Profile />, {
      user: mockUser,
      userId: 1,
      token: 'test-token',
      loading: false,
      error: null,
    })

    const usernameInput = screen.getByDisplayValue('testuser')
    expect(usernameInput).toBeDisabled()
  })

  it('should render phone input field', () => {
    renderWithProviders(<Profile />, {
      user: mockUser,
      userId: 1,
      token: 'test-token',
      loading: false,
      error: null,
    })

    const phoneInput = screen.getByPlaceholderText('请输入手机号')
    expect(phoneInput).toBeInTheDocument()
  })

  it('should render update button', () => {
    renderWithProviders(<Profile />, {
      user: mockUser,
      userId: 1,
      token: 'test-token',
      loading: false,
      error: null,
    })

    expect(screen.getByText('更新信息')).toBeInTheDocument()
  })

  it('should show loading state on button when loading is true', () => {
    renderWithProviders(<Profile />, {
      user: mockUser,
      userId: 1,
      token: 'test-token',
      loading: true,
      error: null,
    })

    const updateButton = screen.getByText('更新信息')
    expect(updateButton.closest('.ant-btn-loading')).toBeInTheDocument()
  })
})

