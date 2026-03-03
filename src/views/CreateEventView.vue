<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: 10,
  category: 'Général'
})

const handleCreateEvent = async () => {
  loading.value = true
  try {
    await api.post('/events', form.value)
    alert('Événement créé avec succès !')
    router.push('/dashboard')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const msg = error.response?.data?.message || "Erreur lors de la création"
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="create-event-container">
    <h2>Créer un nouvel événement</h2>
    <form @submit.prevent="handleCreateEvent" class="event-form">
      <div class="form-group">
        <label>Titre de l'événement</label>
        <input v-model="form.title" type="text" placeholder="Ex: Workshop Vue.js" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" placeholder="Détails de l'événement..." required></textarea>
      </div>

      <div class="form-group">
        <label>Date et Heure</label>
        <input v-model="form.date" type="datetime-local" required />
      </div>

      <div class="form-group">
        <label>Lieu</label>
        <input v-model="form.location" type="text" placeholder="Ex: Paris ou Zoom" required />
      </div>

      <div class="form-group">
        <label>Capacité maximale</label>
        <input v-model="form.capacity" type="number" min="1" required />
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Création en cours...' : 'Publier l\'événement' }}
      </button>
      <button type="button" @click="router.push('/dashboard')" class="cancel-btn">Annuler</button>
    </form>
  </div>
</template>

<style scoped>
.create-event-container { max-width: 600px; margin: 40px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
.event-form { display: flex; flex-direction: column; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 5px; }
.form-group label { font-weight: bold; }
input, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
textarea { height: 100px; resize: vertical; }
.submit-btn { background-color: #27ae60; color: white; padding: 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; }
.submit-btn:disabled { background-color: #95a5a6; }
.cancel-btn { background: none; border: 1px solid #ccc; padding: 8px; cursor: pointer; margin-top: 5px; }
</style>