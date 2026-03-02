<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <nav style="padding: 1rem; border-bottom: 1px solid #ccc; display: flex; gap: 10px">
    <RouterLink to="/">Accueil</RouterLink> |
    <template v-if="!authStore.isAuthenticated">
      <RouterLink to="/login">Connexion</RouterLink>
      <RouterLink to="/register">Inscription</RouterLink>
    </template>
    <template v-else>
      <RouterLink to="/dashboard">Dashboard</RouterLink>
      <button @click="authStore.logout()">Déconnexion</button>
    </template>
  </nav>

  <main style="padding: 2rem">
    <RouterView />
  </main>
</template>
