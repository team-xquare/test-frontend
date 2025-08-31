import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  login: (tokens: { access_token: string; refresh_token: string; user: User }) => void
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null,
      login: ({ access_token, refresh_token, user }) => {
        set({
          isAuthenticated: true,
          user,
          accessToken: access_token,
          refreshToken: refresh_token,
        })
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        })
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)