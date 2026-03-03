import { defineStore } from 'pinia'
import type { User, UserRole } from '@/types/user'

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state): UserRole | null => state.user?.role || null,
    isAdmin: (state) => state.user?.role === 'admin'
  },

  actions: {
    setUser(user: User, token: string) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})