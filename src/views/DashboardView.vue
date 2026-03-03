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

<template>
  <div class="dashboard">
    <div class="header">
        <h1>Tableau de bord ({{ authStore.user?.role }})</h1>
        <button @click="handleLogout" class="logout-btn">Se déconnecter</button>
    </div>
    
    <div v-if="authStore.user?.role === 'admin'" class="admin-panel">
        <button @click="router.push('/admin/users')">Gérer les Utilisateurs</button>
    </div>

    </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; }
.logout-btn { background-color: #e74c3c; color: white; }
.admin-panel { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #000; }
</style>