<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'participant'
})

const handleRegister = () => {
  console.log('Inscription de:', form.value)
  alert('Compte créé (Simulation Jour 1)')
}
</script>

<template>
  <div class="auth-container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="form.name" type="text" placeholder="Nom complet" required />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <select v-model="form.role">
        <option value="participant">Participant</option>
        <option value="organizer">Organisateur</option>
      </select>
      <button type="submit">Créer mon compte</button>
    </form>
  </div>
</template>