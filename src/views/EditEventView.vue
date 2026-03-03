<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/api/axios'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const sending = ref(false)

const form = ref({
  title: '',
  description: '',
  date: '',
  location: '',
  capacity: 10,
  category: 'Général',
})

const fetchEventDetails = async () => {
  try {
    const { data } = await api.get(`/events/${route.params.id}`)

    const formattedDate = new Date(data.date).toISOString().slice(0, 16)

    form.value = {
      title: data.title,
      description: data.description,
      date: formattedDate,
      location: data.location,
      capacity: data.capacity,
      category: data.category,
    }
  } catch (error) {
    alert("Impossible de charger les détails de l'événement")
    router.push('/dashboard')
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  sending.value = true
  try {
    await api.put(`/events/${route.params.id}`, form.value)
    alert('Événement mis à jour !')
    router.push('/dashboard')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erreur lors de la mise à jour')
  } finally {
    sending.value = false
  }
}

onMounted(fetchEventDetails)
</script>

<template>
  <div class="edit-event-container">
    <h2>Modifier l'événement</h2>

    <div v-if="loading">Chargement...</div>

    <form v-else @submit.prevent="handleUpdate" class="event-form">
      <div class="form-group">
        <label>Titre</label>
        <input v-model="form.title" type="text" required />
      </div>

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="form.description" required></textarea>
      </div>

      <div class="form-group">
        <label>Date et Heure</label>
        <input v-model="form.date" type="datetime-local" required />
      </div>

      <div class="form-group">
        <label>Lieu</label>
        <input v-model="form.location" type="text" required />
      </div>

      <div class="form-group">
        <label>Capacité</label>
        <input v-model="form.capacity" type="number" min="1" required />
      </div>

      <div class="actions">
        <button type="submit" :disabled="sending" class="save-btn">
          {{ sending ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
        <button type="button" @click="router.push('/dashboard')" class="cancel-btn">Annuler</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.edit-event-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.event-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
input,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
textarea {
  height: 120px;
}
.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.save-btn {
  flex: 2;
  background: #f39c12;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
.cancel-btn {
  flex: 1;
  background: #95a5a6;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 4px;
  cursor: pointer;
}
.save-btn:disabled {
  opacity: 0.7;
}
</style>
