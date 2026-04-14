const TOKEN_KEY = 'rayshopping_token'
const USER_ID_KEY = 'rayshopping_user_id'

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY)
}

export const getUserId = (): number | null => {
  const userId = localStorage.getItem(USER_ID_KEY)
  return userId ? parseInt(userId) : null
}

export const setUserId = (userId: number): void => {
  localStorage.setItem(USER_ID_KEY, userId.toString())
}

export const removeUserId = (): void => {
  localStorage.removeItem(USER_ID_KEY)
}

export const clearAuth = (): void => {
  removeToken()
  removeUserId()
}

export const isAuthenticated = (): boolean => {
  return !!getToken()
}
