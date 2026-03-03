<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import api from '@/api/axios'

const authStore = useAuthStore()
const router = useRouter()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const handleRegister = async (eventId: string) => {
  try {
    const response = await api.post(`/events/${eventId}/register`)
    alert(response.data.message || 'Inscription réussie !')
    await fetchEvents()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Erreur lors de l'inscription"
    alert(errorMsg)
  }
}

const deleteEvent = async (id: string) => {
  if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
    try {
      await api.delete(`/events/${id}`)
      events.value = events.value.filter((e) => e._id !== id)
      alert('Événement supprimé')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    <div class="events-section">
      <h2>Événements à la une</h2>

      <div v-if="loading">Chargement des événements...</div>

      <div v-else-if="events.length === 0" class="no-events">
        Aucun événement disponible pour le moment.
      </div>

      <div v-else class="event-grid">
        <div v-for="event in events" :key="event._id" class="event-card">
          <div class="event-header">
            <span class="category-badge">{{ event.category }}</span>
            <h3>{{ event.title }}</h3>
          </div>

          <p class="description">{{ event.description }}</p>

          <div class="event-info">
            <p>📍 <strong>Lieu :</strong> {{ event.location }}</p>
            <p>📅 <strong>Date :</strong> {{ new Date(event.date).toLocaleDateString() }}</p>
            <p>👥 <strong>Places :</strong> {{ event.attendees.length }} / {{ event.capacity }}</p>
          </div>

          <div
            v-if="
              authStore.user?.role === 'admin' ||
              (authStore.user?.role === 'organizer' && event.organizer?._id === authStore.user?._id)
            "
            class="owner-controls"
          >
            <button @click="router.push(`/events/edit/${event._id}`)" class="edit-btn">
              ✏️ Modifier
            </button>
            <button @click="deleteEvent(event._id)" class="delete-btn">🗑️ Supprimer</button>
          </div>

          <div
            v-if="
              authStore.user?.role === 'admin' ||
              (authStore.user?.role === 'organizer' && event.organizer?._id === authStore.user?._id)
            "
            class="attendees-list"
          >
            <h4>👥 Liste des inscrits ({{ event.attendees.length }})</h4>
            <ul v-if="event.attendees.length > 0">
              <li v-for="guest in event.attendees" :key="guest._id">
                {{ guest.name }} ({{ guest.email }})
              </li>
            </ul>
            <p v-else class="no-data">Personne n'est encore inscrit.</p>
          </div>

          <button
            v-if="authStore.user?.role === 'participant'"
            class="register-btn"
            @click="handleRegister(event._id)"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}
.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
}
.admin-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid #000;
}
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
.events-section {
  margin-top: 30px;
}
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}
.event-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s;
}
.event-card:hover {
  transform: translateY(-5px);
}
.category-badge {
  background: #eee;
  font-size: 0.7em;
  padding: 3px 8px;
  border-radius: 10px;
  text-transform: uppercase;
}
.description {
  color: #666;
  font-size: 0.9em;
  margin: 10px 0;
}
.event-info p {
  margin: 5px 0;
  font-size: 0.85em;
}
.register-btn {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.owner-controls {
  display: flex;
  gap: 10px;
  margin: 15px 0;
  padding-bottom: 15px;
  border-bottom: 1px dashed #ddd;
}

.edit-btn {
  flex: 1;
  background-color: #f39c12;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.delete-btn {
  flex: 1;
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 4px;
  cursor: pointer;
}

.edit-btn:hover {
  background-color: #e67e22;
}
.delete-btn:hover {
  background-color: #c0392b;
}

.attendees-list {
  background: #f9f9f9;
  padding: 10px;
  border-radius: 6px;
  margin-top: 10px;
}
.attendees-list ul {
  list-style: none;
  padding: 0;
}
.attendees-list li {
  font-size: 0.8em;
  padding: 4px 0;
  border-bottom: 1px solid #eee;
}
</style>
