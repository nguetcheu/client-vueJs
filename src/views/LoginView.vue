<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { UserRole } from '@/types/user'

const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')

const handleLogin = () => {
  const mockRole: UserRole = email.value.includes('admin') ? 'admin' : 'participant'

  authStore.setUser(
    {
      _id: '1',
      name: 'Utilisateur Test',
      email: email.value,
      role: mockRole, 
    },
    'fake-jwt-token',
  )

  router.push('/dashboard')
}
</script>

<template>
  <div class="auth-container">
    <h2>Connexion</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit">Se connecter</button>
    </form>
  </div>
</template>