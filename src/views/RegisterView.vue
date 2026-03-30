<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ name: '', email: '', password: '', role: 'participant' })
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  try {
    await api.post('/auth/register', form.value)
    alert('Compte créé avec succès ! Connectez-vous.')
    router.push('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    const message = error.response?.data?.message || "Erreur serveur"
    alert("Détail de l'erreur : " + message)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h2>Rejoignez EventFlow</h2>
        <p>Créez votre compte pour gérer ou participer à des événements.</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label>Nom complet</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="Ex: Jean Dupont"
            required
          />
        </div>

        <div class="input-group">
          <label>Adresse Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="nom@exemple.com"
            required
          />
        </div>

        <div class="input-group">
          <label>Mot de passe</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Minimum 6 caractères"
            required
          />
        </div>

        <div class="input-group">
          <label>Je suis un...</label>
          <select v-model="form.role" class="role-select">
            <option value="participant">Participant (je m'inscris aux événements)</option>
            <option value="organizer">Organisateur (je crée des événements)</option>
          </select>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          {{ loading ? 'Création en cours...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="auth-footer">
        Déjà inscrit ? <router-link to="/login">Connectez-vous ici</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 20px;
}

.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02);
  width: 100%;
  max-width: 450px;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h2 {
  font-size: 1.75rem;
  color: #1e293b;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
  margin-left: 4px;
}

input, .role-select {
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fcfcfd;
}

input:focus, .role-select:focus {
  outline: none;
  border-color: #6366f1;
  background: white;
  box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
}

.role-select {
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Length 19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.2em;
}

.btn-submit {
  width: 100%;
  background: #6366f1;
  color: white;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: #4f46e5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.btn-submit:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #64748b;
}

.auth-footer a {
  color: #6366f1;
  font-weight: 700;
  text-decoration: none;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style>
