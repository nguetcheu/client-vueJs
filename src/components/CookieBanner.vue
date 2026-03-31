<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const preferences = ref({
  necessary: true,
  analytics: false,
  marketing: false,
})

onMounted(() => {
  const saved = localStorage.getItem('eventflow_cookies')
  if (!saved) isVisible.value = true
})

const savePreferences = (all = false) => {
  if (all) {
    preferences.value.analytics = true
    preferences.value.marketing = true
  }
  localStorage.setItem(
    'eventflow_cookies',
    JSON.stringify({
      ...preferences.value,
      date: new Date().toISOString(),
    }),
  )
  isVisible.value = false
}
</script>

<template>
  <div v-if="isVisible" class="cookie-overlay">
    <div class="cookie-card">
      <h3>Gestion des Cookies 🍪</h3>
      <p>Nous utilisons des cookies pour améliorer votre expérience.</p>

      <div class="cookie-options">
        <label><input type="checkbox" checked disabled /> Nécessaires (Système)</label>
        <label><input type="checkbox" v-model="preferences.analytics" /> Analytiques</label>
        <label><input type="checkbox" v-model="preferences.marketing" /> Marketing</label>
      </div>

      <div class="cookie-actions">
        <button @click="savePreferences(false)" class="btn-secondary">Enregistrer mes choix</button>
        <button @click="savePreferences(true)" class="btn-primary">Tout accepter</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cookie-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  padding: 1.5rem;
}
.cookie-card {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
}
.cookie-options {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}
.cookie-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
.btn-secondary {
  background: #e2e8f0;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}
</style>
