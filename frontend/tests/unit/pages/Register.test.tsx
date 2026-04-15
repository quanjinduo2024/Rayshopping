import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import Register from '@/pages/user/Register'
import userReducer from '@/store/userSlice'

// Mock react-router-dom
const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null }),
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

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render register form correctly', () => {
    renderWithProviders(<Register />)

    expect(screen.getByText('用户注册')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('用户名')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('密码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('确认密码')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('手机号（可选）')).toBeInTheDocument()
    expect(screen.getByText('注册')).toBeInTheDocument()
    expect(screen.getByText('已有账号？')).toBeInTheDocument()
    expect(screen.getByText('立即登录')).toBeInTheDocument()
  })

  it('should show validation errors for short username', async () => {
    renderWithProviders(<Register />)

    const usernameInput = screen.getByPlaceholderText('用户名')
    fireEvent.change(usernameInput, { target: { value: 'ab' } })
    fireEvent.blur(usernameInput)

    await waitFor(() => {
      expect(screen.getByText('用户名至少3个字符')).toBeInTheDocument()
    })
  })

  it('should show validation errors for short password', async () => {
    renderWithProviders(<Register />)

    const passwordInput = screen.getByPlaceholderText('密码')
    fireEvent.change(passwordInput, { target: { value: '12345' } })
    fireEvent.blur(passwordInput)

    await waitFor(() => {
      expect(screen.getByText('密码至少6个字符')).toBeInTheDocument()
    })
  })

  it('should show error when passwords do not match', async () => {
    renderWithProviders(<Register />)

    const passwordInput = screen.getByPlaceholderText('密码')
    const confirmInput = screen.getByPlaceholderText('确认密码')

    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmInput, { target: { value: 'password456' } })
    fireEvent.blur(confirmInput)

    await waitFor(() => {
      expect(screen.getByText('两次输入的密码不一致')).toBeInTheDocument()
    })
  })

  it('should navigate to home page when registration successful', () => {
    renderWithProviders(<Register />, {
      userId: 1,
      token: 'test-token',
      user: null,
      loading: false,
      error: null,
    })

    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})

