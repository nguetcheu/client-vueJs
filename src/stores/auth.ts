import { defineStore } from 'pinia'
import type { User, UserRole } from '@/types/user'

interface AuthState {
  user: User | null
  token: string
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem('token') || ''
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUserRole: (state): UserRole | null => state.user?.role || null
  },
  actions: {
    setUser(user: User, token: string) {
      this.user = user
      this.token = token
      localStorage.setItem('token', token)
    },
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('token')
    }
  }
})