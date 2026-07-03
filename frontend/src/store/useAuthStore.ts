import { create } from 'zustand'

export interface AuthUser {
  _id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  login: (user: AuthUser, token: string) => void
  logout: () => void
}

/* ── Rehydrate from localStorage on first load ──────────────────────────── */
const persistedToken = localStorage.getItem('chronicle_token')
const persistedUser = localStorage.getItem('chronicle_user')

export const useAuthStore = create<AuthState>((set) => ({
  user: persistedUser ? JSON.parse(persistedUser) : null,
  token: persistedToken ?? null,
  isAuthenticated: !!persistedToken,

  login: (user, token) => {
    localStorage.setItem('chronicle_token', token)
    localStorage.setItem('chronicle_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('chronicle_token')
    localStorage.removeItem('chronicle_user')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
