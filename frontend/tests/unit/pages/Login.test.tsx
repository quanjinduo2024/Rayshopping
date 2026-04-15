import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import Login from '@/pages/user/Login'
import userReducer from '@/store/userSlice'

// Mock react-router-dom
const mockNavigate = vi.fn()
const mockLocation = { state: null }

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  }
})

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

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render login form correctly', () => {
    renderWithProviders(<Login />)

    expect(screen.getByText('用户登录')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
    expect(screen.getByText('登录')).toBeInTheDocument()
    expect(screen.getByText('还没有账号？')).toBeInTheDocument()
    expect(screen.getByText('立即注册')).toBeInTheDocument()
  })

  it('should show validation errors when form is submitted empty', async () => {
    renderWithProviders(<Login />)

    const loginButton = screen.getByText('登录')
    fireEvent.click(loginButton)

    await waitFor(() => {
      expect(screen.getByText('请输入用户名')).toBeInTheDocument()
    })
  })

  it('should navigate to home page when already logged in', () => {
    renderWithProviders(<Login />, {
      userId: 1,
      token: 'test-token',
      user: null,
      loading: false,
      error: null,
    })

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
  })

  it('should navigate to redirect path when present', () => {
    mockLocation.state = { from: { pathname: '/profile' } }

    renderWithProviders(<Login />, {
      userId: 1,
      token: 'test-token',
      user: null,
      loading: false,
      error: null,
    })

    expect(mockNavigate).toHaveBeenCalledWith('/profile', { replace: true })
  })
})

