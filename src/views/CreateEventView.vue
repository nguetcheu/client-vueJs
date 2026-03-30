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
  category: 'Général',
})

const handleCreateEvent = async () => {
  loading.value = true
  try {
    await api.post('/events', form.value)
    alert('Événement créé avec succès !')
    router.push('/dashboard')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const msg = error.response?.data?.message || 'Erreur lors de la création'
    alert(msg)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="page-container">
    <div class="form-card">
      <div class="form-header">
        <button @click="router.push('/dashboard')" class="btn-back">← Retour</button>
        <h2>Créer un événement</h2>
        <p>Remplissez les détails ci-dessous pour publier votre événement.</p>
      </div>

      <form @submit.prevent="handleCreateEvent" class="event-form">
        <div class="form-section">
          <div class="form-group">
            <label>Titre de l'événement</label>
            <input v-model="form.title" type="text" placeholder="Ex: Workshop Vue.js 3" required />
          </div>

          <div class="form-group">
            <label>Catégorie</label>
            <select v-model="form.category">
              <option value="Général">Général</option>
              <option value="Technologie">Technologie</option>
              <option value="Sport">Sport</option>
              <option value="Loisirs">Loisirs</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea
            v-model="form.description"
            placeholder="Dites-en plus sur le programme..."
            required
          ></textarea>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label>Date et Heure</label>
            <input v-model="form.date" type="datetime-local" required />
          </div>

          <div class="form-group">
            <label>Capacité</label>
            <input v-model="form.capacity" type="number" min="1" required />
          </div>
        </div>

        <div class="form-group">
          <label>Lieu</label>
          <input
            v-model="form.location"
            type="text"
            placeholder="Ex: Paris, Zoom, ou hybride"
            required
          />
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn-submit">
            {{ loading ? 'Publication...' : "Publier l'événement" }}
          </button>
          <button type="button" @click="router.push('/dashboard')" class="btn-cancel">
            Annuler
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 90vh;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  background: #f8fafc;
}
.form-card {
  background: white;
  width: 100%;
  max-width: 700px;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.form-header {
  margin-bottom: 2rem;
}
.btn-back {
  background: none;
  border: none;
  color: #6366f1;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  margin-bottom: 1rem;
}
.form-header h2 {
  font-size: 1.8rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}
.form-header p {
  color: #64748b;
}

.event-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
.form-section,
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

/* Responsive grid sur mobile */
@media (max-width: 600px) {
  .form-section,
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #475569;
}

input,
textarea,
select {
  padding: 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.2s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}
textarea {
  height: 120px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-submit {
  flex: 2;
  background: #10b981;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}
.btn-submit:hover {
  background: #059669;
  transform: translateY(-1px);
}
.btn-submit:disabled {
  background: #cbd5e1;
}
.btn-cancel {
  flex: 1;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
</style>
