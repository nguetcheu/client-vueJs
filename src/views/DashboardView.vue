<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const authStore = useAuthStore()
const router = useRouter()
const events = ref<any[]>([])
const loading = ref(true)

const fetchEvents = async () => {
  try {
    const response = await api.get('/events')
    events.value = response.data
  } catch (error) {
    console.error('Erreur lors de la récupération des événements', error)
  } finally {
    loading.value = false
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const isUserRegistered = (event: any) => {
  if (!authStore.user) return false
  return event.attendees.some((attendee: any) => {
    const attendeeId = typeof attendee === 'object' ? attendee._id : attendee
    return attendeeId === authStore.user?._id
  })
}

const handleRegister = async (eventId: string) => {
  try {
    const response = await api.post(`/events/${eventId}/register`)
    alert(response.data.message || 'Inscription réussie !')
    await fetchEvents()
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Erreur lors de l'inscription"
    alert(errorMsg)
  }
}

const handleUnregister = async (eventId: string) => {
  if (confirm('Voulez-vous vraiment annuler votre participation ?')) {
    try {
      const response = await api.post(`/events/${eventId}/unregister`)
      alert(response.data.message || 'Désinscription réussie')
      await fetchEvents()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la désinscription')
    }
  }
}

const deleteEvent = async (id: string) => {
  if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
    try {
      await api.delete(`/events/${id}`)
      events.value = events.value.filter((e) => e._id !== id)
      alert('Événement supprimé')
    } catch (error: any) {
      alert('Erreur lors de la suppression')
    }
  }
}

const goToEdit = (id: string) => {
  router.push(`/events/edit/${id}`)
}

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <div class="welcome-text">
        <h1>Tableau de bord</h1>
        <p>
          Bienvenue, <strong>{{ authStore.user?.name }}</strong>
          <span class="role-tag">{{ authStore.user?.role }}</span>
        </p>
      </div>
      <button @click="handleLogout" class="btn-logout">Se déconnecter</button>
    </header>

    <section class="action-grid">
      <div v-if="authStore.user?.role === 'admin'" class="card admin-card">
        <h3>Administration</h3>
        <p>Gérez l'ensemble des utilisateurs de la plateforme.</p>
        <button @click="router.push('/admin/users')" class="btn-primary">
          Gérer les Utilisateurs
        </button>
      </div>

      <div
        v-if="authStore.user?.role === 'organizer' || authStore.user?.role === 'admin'"
        class="card organizer-card"
      >
        <h3>Organisateur</h3>
        <p>Créez de nouveaux événements pour la communauté.</p>
        <button @click="router.push('/events/create')" class="btn-success">
          ➕ Créer un événement
        </button>
      </div>
    </section>

    <section class="events-section">
      <div class="section-header">
        <h2>Événements disponibles</h2>
        <span class="count-badge">{{ events.length }} événements</span>
      </div>

      <div v-if="loading" class="loader">Chargement des événements...</div>

      <div v-else-if="events.length === 0" class="empty-state">
        <p>Aucun événement disponible pour le moment.</p>
      </div>

      <div v-else class="event-grid">
        <div v-for="event in events" :key="event._id" class="event-card">
          <div class="event-content">
            <span class="category">{{ event.category }}</span>
            <h3>{{ event.title }}</h3>
            <p class="description">{{ event.description }}</p>

            <div class="info-list">
              <span>📍 {{ event.location }}</span>
              <span
                >📅
                {{
                  new Date(event.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                  })
                }}</span
              >
              <span>👥 {{ event.attendees.length }} / {{ event.capacity }} inscrits</span>
            </div>
          </div>

          <div
            v-if="
              authStore.user?.role === 'admin' ||
              (authStore.user?.role === 'organizer' && event.organizer?._id === authStore.user?._id)
            "
            class="management-zone"
          >
            <button @click="goToEdit(event._id)" class="btn-edit">Modifier</button>
            <button @click="deleteEvent(event._id)" class="btn-delete">Supprimer</button>
          </div>

          <div v-if="authStore.user?.role === 'participant'" class="registration-actions">
            <button
              v-if="isUserRegistered(event)"
              @click="handleUnregister(event._id)"
              class="btn-unregister"
            >
              Annuler ma participation
            </button>

            <button
              v-else
              @click="handleRegister(event._id)"
              class="btn-register"
              :disabled="event.attendees.length >= event.capacity"
            >
              {{ event.attendees.length >= event.capacity ? 'Complet' : "S'inscrire" }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

.role-tag {
  background: #e0e7ff;
  color: #4338ca;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-left: 10px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.card {
  padding: 1.5rem;
  border-radius: 12px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.admin-card {
  border-left: 4px solid #6366f1;
}

.organizer-card {
  border-left: 4px solid #10b981;
}

.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.event-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.event-content {
  padding: 1.5rem;
  flex-grow: 1;
}

.category {
  font-size: 0.7rem;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.info-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #64748b;
}

.btn-primary {
  background: #6366f1;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-success {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-logout {
  background: transparent;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #ef4444;
}

.btn-register {
  width: 100%;
  padding: 12px;
  border: none;
  background: #6366f1;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.btn-register:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}

.btn-unregister {
  width: 100%;
  padding: 12px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  border-top: 1px solid #f1f5f9;
  transition: all 0.2s ease;
}

.btn-unregister:hover {
  background: #fff1f2;
  color: #ef4444;
}

.registration-actions {
  width: 100%;
}

.management-zone {
  display: flex;
  gap: 1px;
  background: #f1f5f9;
  border-top: 1px solid #f1f5f9;
}

.btn-edit,
.btn-delete {
  flex: 1;
  padding: 10px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  background: white;
}

.btn-edit {
  color: #f59e0b;
  border-right: 1px solid #f1f5f9;
}

.btn-delete {
  color: #ef4444;
}
</style>
