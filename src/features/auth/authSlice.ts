import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean
  email: string | null
  theme: 'light' | 'dark'
}

const persistedAuth = localStorage.getItem('portfolio-auth')
const persistedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null

const initialState: AuthState = {
  isAuthenticated: persistedAuth === 'true',
  email: persistedAuth === 'true' ? 'demo@portfolio.com' : null,
  theme: persistedTheme ?? 'dark',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<string>) {
      state.isAuthenticated = true
      state.email = action.payload
      localStorage.setItem('portfolio-auth', 'true')
    },
    logout(state) {
      state.isAuthenticated = false
      state.email = null
      localStorage.removeItem('portfolio-auth')
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload
      localStorage.setItem('portfolio-theme', action.payload)
    },
  },
})

export const { loginSuccess, logout, setTheme } = authSlice.actions
export default authSlice.reducer
