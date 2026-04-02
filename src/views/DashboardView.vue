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

const isUserInWaitingList = (event: any) => {
  if (!authStore.user || !event.waitingList) return false
  return event.waitingList.some((waitingUser: any) => {
    const waitingId = typeof waitingUser === 'object' ? waitingUser._id : waitingUser
    return waitingId === authStore.user?._id
  })
}

const handleRegister = async (eventId: string) => {
  try {
    const response = await api.post(`/events/${eventId}/register`)

    if (response.data.status === 'waiting') {
      alert("Événement complet ! Vous avez été ajouté à la file d'attente ⏳")
    } else {
      alert(response.data.message || 'Inscription réussie ! ✅')
    }

    await fetchEvents()
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || "Erreur lors de l'inscription"
    alert(errorMsg)
  }
}

const downloadCSV = async (eventId: string, eventTitle: string) => {
  try {
    const response = await api.get(`/events/${eventId}/export`, {
      responseType: 'blob',
    })

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `participants-${eventTitle}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    alert('Erreur lors du téléchargement du fichier CSV')
  }
}

const handleUnregister = async (eventId: string) => {
  const message = "Voulez-vous vraiment annuler votre demande pour cet événement ?"
  if (confirm(message)) {
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
      <div class="header-btns">
         <button @click="handleLogout" class="btn-logout">Se déconnecter</button>
      </div>
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
              <span>📅 {{ new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }) }}</span>
              <span>👥 {{ event.attendees.length }} / {{ event.capacity }} inscrits</span>
              <span v-if="event.waitingList?.length > 0" class="waiting-count">
                ⏳ {{ event.waitingList.length }} en attente
              </span>
            </div>
          </div>

          <div
            v-if="authStore.user?.role === 'admin' || (authStore.user?.role === 'organizer' && event.organizer?._id === authStore.user?._id)"
            class="management-zone"
          >
            <button @click="goToEdit(event._id)" class="btn-edit" title="Modifier">✏️</button>
            <button @click="downloadCSV(event._id, event.title)" class="btn-export" title="Exporter CSV">📥 CSV</button>
            <button @click="deleteEvent(event._id)" class="btn-delete" title="Supprimer">🗑️</button>
          </div>

          <div v-if="authStore.user?.role === 'participant'" class="registration-actions">

            <button
              v-if="isUserRegistered(event)"
              @click="handleUnregister(event._id)"
              class="btn-unregister"
            >
              ✅ Inscrit (Annuler)
            </button>

            <button
              v-else-if="isUserInWaitingList(event)"
              @click="handleUnregister(event._id)"
              class="btn-waiting"
            >
              ⏳ En attente (Quitter)
            </button>

            <button
              v-else
              @click="handleRegister(event._id)"
              :class="['btn-register', event.attendees.length >= event.capacity ? 'btn-queue' : '']"
            >
              {{ event.attendees.length >= event.capacity ? '🏃 Rejoindre la file' : "S'inscrire" }}
            </button>

          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Tes styles existants conservés + ajouts pour la file d'attente */

.dashboard-container { max-width: 1100px; margin: 0 auto; padding: 2rem 1rem; }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
.header-btns { display: flex; gap: 10px; }

.btn-calendar {
  background: white;
  border: 1px solid #6366f1;
  color: #6366f1;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

.waiting-count {
  font-size: 0.8rem;
  color: #f59e0b;
  font-weight: 600;
}

/* Bouton Spécifique File d'attente (Orange) */
.btn-waiting {
  width: 100%;
  padding: 12px;
  border: none;
  background: #f59e0b;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

/* Bouton Spécifique "Rejoindre la file" (Gris/Bleu) */
.btn-queue {
  background: #475569 !important;
}

/* Reste du CSS existant... */
.role-tag { background: #e0e7ff; color: #4338ca; padding: 2px 10px; border-radius: 12px; font-size: 0.75rem; text-transform: uppercase; margin-left: 10px; }
.action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
.card { padding: 1.5rem; border-radius: 12px; background: white; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
.admin-card { border-left: 4px solid #6366f1; }
.organizer-card { border-left: 4px solid #10b981; }

.event-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
.event-card { background: white; border-radius: 16px; border: 1px solid #f1f5f9; display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s; overflow: hidden; }
.event-card:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
.event-content { padding: 1.5rem; flex-grow: 1; }
.category { font-size: 0.7rem; font-weight: 700; color: #6366f1; text-transform: uppercase; letter-spacing: 0.05em; }
.info-list { margin-top: 1rem; display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.9rem; color: #64748b; }

.btn-primary { background: #6366f1; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn-success { background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; }
.btn-logout { background: transparent; border: 1px solid #e2e8f0; padding: 8px 16px; border-radius: 8px; cursor: pointer; color: #ef4444; }

.btn-register { width: 100%; padding: 12px; border: none; background: #6366f1; color: white; font-weight: 600; cursor: pointer; }
.btn-unregister { width: 100%; padding: 12px; border: none; background: #ecfdf5; color: #059669; font-weight: 600; cursor: pointer; border-top: 1px solid #f1f5f9; }
.btn-unregister:hover { background: #fff1f2; color: #ef4444; }

.management-zone { display: flex; gap: 1px; background: #f1f5f9; border-top: 1px solid #f1f5f9; }
.btn-edit, .btn-export, .btn-delete { flex: 1; padding: 10px; border: none; cursor: pointer; font-size: 0.85rem; background: white; }
.btn-edit { color: #f59e0b; border-right: 1px solid #f1f5f9; }
.btn-export { color: #10b981; border-right: 1px solid #f1f5f9; }
.btn-delete { color: #ef4444; }
</style>
