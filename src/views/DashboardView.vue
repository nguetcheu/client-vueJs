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
      <h2>Actions Administrateur</h2>
      <button @click="router.push('/admin/users')">Gérer les Utilisateurs</button>
    </div>

    <div
      v-if="authStore.user?.role === 'organizer' || authStore.user?.role === 'admin'"
      class="organizer-panel"
    >
      <h2>Actions Organisateur</h2>
      <p>Vous pouvez créer et gérer vos propres événements ici.</p>
      <button @click="router.push('/events/create')" class="create-btn">
        ➕ Créer un événement
      </button>
    </div>

    <div v-if="authStore.user?.role === 'participant'" class="participant-panel">
      <h2>Bienvenue !</h2>
      <p>Consultez la liste des événements disponibles pour vous inscrire.</p>
    </div>
  </div>
</template>

<style scoped>
.organizer-panel {
  background: #e8f5e9;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #2e7d32;
}

.create-btn {
  background-color: #2e7d32;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.create-btn:hover {
  background-color: #1b5e20;
}

.participant-panel {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #1565c0;
}
</style>