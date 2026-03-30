<script setup lang="ts">
import { RouterView, RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="main-nav">
    <div class="nav-container">
      <RouterLink to="/" class="brand">Event<span>Flow</span></RouterLink>

      <div class="nav-links">
        <RouterLink to="/" class="link">Accueil</RouterLink>

        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/login" class="link">Connexion</RouterLink>
          <RouterLink to="/register" class="btn-cta">S'inscrire</RouterLink>
        </template>

        <template v-else>
          <RouterLink to="/dashboard" class="link">Dashboard</RouterLink>
          <button @click="handleLogout" class="btn-minimal">Déconnexion</button>
        </template>
      </div>
    </div>
  </nav>

  <main class="content-wrapper">
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>
</template>

<style>
/* Reset global */
body {
  margin: 0;
  font-family: 'Inter', sans-serif;
  background: #f8fafc;
  color: #1e293b;
}

.main-nav {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
}

.brand {
  font-size: 1.4rem;
  font-weight: 800;
  text-decoration: none;
  color: #1e293b;
}

.brand span {
  color: #6366f1;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.link {
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
}

.link:hover,
.router-link-active {
  color: #6366f1;
}

.btn-cta {
  background: #6366f1;
  color: white;
  padding: 8px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.2s;
}

.btn-cta:hover {
  opacity: 0.9;
}

.btn-minimal {
  background: none;
  border: none;
  color: #ef4444;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-size: 0.95rem;
}

.content-wrapper {
  padding-top: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
