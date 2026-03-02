<script setup lang="ts">
import { ref } from 'vue'
import type { Event } from '@/types/event'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const events = ref<Event[]>([
  {
    _id: '1',
    title: 'Conférence Vue.js',
    description: 'Tout sur la version 3',
    date: '2024-10-10',
    location: 'Paris',
    capacity: 50,
    attendees: [],
    createdBy: 'admin',
  },
  {
    _id: '2',
    title: 'Workshop Docker',
    description: 'Apprendre à conteneuriser',
    date: '2024-11-15',
    location: 'Lyon',
    capacity: 20,
    attendees: [],
    createdBy: 'org1',
  },
])
</script>

<template>
  <div class="dashboard">
    <h1>Tableau de bord ({{ authStore.user?.role }})</h1>

    <div class="event-grid">
      <div v-for="event in events" :key="event._id" class="event-card">
        <h3>{{ event.title }}</h3>
        <p>{{ event.location }} - {{ event.date }}</p>
        <button v-if="authStore.user?.role === 'participant'">S'inscrire</button>
        <button v-if="authStore.user?.role === 'organizer'" class="edit-btn">Modifier</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}
.event-card {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}
.edit-btn {
  background-color: #f39c12;
  color: white;
}
</style>
