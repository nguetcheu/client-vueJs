<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axios' 

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const response = await api.post('/auth/login', {
      email: email.value,
      password: password.value
    })
    
    authStore.setUser(response.data, response.data.token)
    router.push('/dashboard')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    alert('Identifiants incorrects')
  }
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