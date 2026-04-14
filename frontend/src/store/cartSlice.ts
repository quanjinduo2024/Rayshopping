import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { CartItem, AddCartRequest, UpdateCartRequest } from '@/types/cart'
import { shopService } from '@/services/shopService'

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
}

export const fetchCartList = createAsyncThunk<CartItem[], void>(
  'cart/fetchCartList',
  async () => {
    const response = await shopService.getCartList()
    return response.items
  }
)

export const addToCart = createAsyncThunk<CartItem, AddCartRequest>(
  'cart/addToCart',
  async (data) => {
    return await shopService.addToCart(data)
  }
)

export const updateCartItem = createAsyncThunk<CartItem, UpdateCartRequest>(
  'cart/updateCartItem',
  async (data) => {
    return await shopService.updateCart(data)
  }
)

export const deleteCartItem = createAsyncThunk<number, number>(
  'cart/deleteCartItem',
  async (cartId) => {
    await shopService.deleteCart(cartId)
    return cartId
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = []
    },
    clearCartError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart list
      .addCase(fetchCartList.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCartList.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCartList.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '获取购物车失败'
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false
        const existingIndex = state.items.findIndex((item) => item.cart_id === action.payload.cart_id)
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload
        } else {
          state.items.push(action.payload)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '添加购物车失败'
      })
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem>) => {
        state.loading = false
        const index = state.items.findIndex((item) => item.cart_id === action.payload.cart_id)
        if (index >= 0) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新购物车失败'
      })
      // Delete cart item
      .addCase(deleteCartItem.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteCartItem.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false
        state.items = state.items.filter((item) => item.cart_id !== action.payload)
      })
      .addCase(deleteCartItem.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '删除购物车失败'
      })
  },
})

export const { clearCart, clearCartError } = cartSlice.actions
export default cartSlice.reducer
