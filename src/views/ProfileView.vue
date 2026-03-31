<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const userDetails = ref<any>(null)
const loading = ref(true)
const updating = ref(false)

const form = ref({
  name: '',
  email: '',
  phone: ''
})

const fetchProfile = async () => {
  try {
    const { data } = await api.get('/me')
    userDetails.value = data
    form.value = {
      name: data.name,
      email: data.email,
      phone: data.phone || ''
    }
  } catch (e) {
    alert('Erreur de récupération des données')
  } finally {
    loading.value = false
  }
}

const handleUpdate = async () => {
  updating.value = true
  try {
    const { data } = await api.put('/me', form.value)
    userDetails.value = data

    if (authStore.user) {
      authStore.user.name = data.name
      authStore.user.email = data.email
      localStorage.setItem('user', JSON.stringify(authStore.user))
    }

    alert('Informations mises à jour avec succès !')
  } catch (error: any) {
    alert(error.response?.data?.message || 'Erreur lors de la mise à jour')
  } finally {
    updating.value = false
  }
}

const handleAnonymize = async () => {
  if (confirm('Action irréversible : Votre compte sera anonymisé. Continuer ?')) {
    try {
      await api.delete('/me')
      authStore.logout()
      window.location.href = '/'
    } catch (e) {
      alert("Erreur lors de l'anonymisation")
    }
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="profile-page">
    <h1>Mon Profil & Données (RGPD)</h1>

    <div v-if="loading">Chargement...</div>

    <div v-else class="profile-layout">
      <section class="profile-card edit-section">
        <h3>Droit de rectification : Modifier mes données</h3>
        <form @submit.prevent="handleUpdate" class="edit-form">
          <div class="form-group">
            <label>Nom complet</label>
            <input v-model="form.name" type="text" required />
          </div>
          <div class="form-group">
            <label>Adresse Email</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Téléphone (Optionnel)</label>
            <input v-model="form.phone" type="tel" placeholder="Non renseigné" />
          </div>
          <button type="submit" :disabled="updating" class="btn-save">
            {{ updating ? 'Enregistrement...' : 'Enregistrer les modifications' }}
          </button>
        </form>
      </section>

      <section class="profile-card">
        <h3>Droit d'accès : Visualiser mes données stockées</h3>
        <pre class="json-display">{{ userDetails }}</pre>
      </section>

      <section class="profile-card danger-zone">
        <h3>Droit à l'oubli</h3>
        <p>
          En cliquant ici, vos données nominatives seront remplacées par des données aléatoires.
          Cette action est définitive.
        </p>
        <button @click="handleAnonymize" class="btn-delete">Anonymiser mon compte</button>
      </section>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.profile-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.form-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 1rem;
}

.btn-save {
  background: #6366f1;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
}

.json-display {
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  overflow-x: auto;
  color: #475569;
}

.danger-zone {
  border: 1px solid #fee2e2;
  background: #fffafb;
}

.danger-zone h3 {
  color: #991b1b;
}

.btn-delete {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  margin-top: 1rem;
}

.btn-delete:hover {
  background: #dc2626;
}
</style>
