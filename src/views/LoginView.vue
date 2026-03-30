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
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Bon retour !</h2>
        <p>Connectez-vous à votre compte EventFlow</p>
      </div>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label>Adresse Email</label>
          <input v-model="email" type="email" placeholder="nom@exemple.com" required />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input v-model="password" type="password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-submit">Se connecter</button>
      </form>

      <p class="auth-footer">
        Pas encore de compte ? <router-link to="/register">Inscrivez-vous</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
.auth-card { background: white; padding: 2.5rem; border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
.auth-header { text-align: center; margin-bottom: 2rem; }
.auth-header h2 { font-size: 1.8rem; color: #1e293b; margin-bottom: 0.5rem; }
.auth-header p { color: #64748b; font-size: 0.95rem; }

.input-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
.input-group label { font-size: 0.85rem; font-weight: 600; color: #475569; }
input { padding: 12px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 1rem; transition: all 0.2s; }
input:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

.btn-submit { width: 100%; background: #6366f1; color: white; padding: 12px; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-top: 1rem; }
.btn-submit:hover { background: #4f46e5; }
.auth-footer { margin-top: 1.5rem; text-align: center; font-size: 0.9rem; color: #64748b; }
.auth-footer a { color: #6366f1; font-weight: 600; text-decoration: none; }
</style>
