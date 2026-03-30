<template>
  <div class="home">
    <div class="hero-section">
      <h1>EVENTFLOW</h1>
      <p v-if="!authStore.isAuthenticated">Gérez vos événements avec fluidité et sécurité.</p>
      <p v-else>Ravi de vous revoir, <strong>{{ authStore.user?.name }}</strong> !</p>

      <div class="cta">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/register" class="btn btn-primary">Commencer maintenant</router-link>
          <router-link to="/login" class="btn btn-outline">Se connecter</router-link>
        </template>

        <template v-else>
          <router-link v-if="authStore.isAdmin" to="/admin/users" class="btn btn-admin">Panel Admin</router-link>
          <router-link to="/dashboard" class="btn btn-primary">Accéder à mes événements</router-link>
          <button @click="handleLogout" class="btn btn-logout">Déconnexion</button>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
}
.hero-section { max-width: 600px; padding: 2rem; }
h1 { font-size: 3.5rem; color: #1e293b; margin-bottom: 1rem; font-weight: 800; }
p { font-size: 1.2rem; color: #64748b; margin-bottom: 2rem; }

.cta { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
.btn {
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}
.btn-primary { background: #6366f1; color: white; }
.btn-outline { border: 2px solid #6366f1; color: #6366f1; background: transparent; }
.btn-logout { background: #fee2e2; color: #ef4444; }
.btn-admin { background: #f59e0b; color: white; }

.btn:hover { transform: translateY(-2px); opacity: 0.9; }
</style>
