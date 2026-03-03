<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ name: '', email: '', password: '', role: 'participant' })

const handleRegister = async () => {
  try {
    await api.post('/auth/register', form.value)
    alert('Compte créé avec succès ! Connectez-vous.')
    router.push('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    const message = error.response?.data?.message || "Erreur serveur";
    alert("Détail de l'erreur : " + message);
  }
}
</script>

<template>
  <div class="auth-container">
    <h2>Inscription</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="form.name" type="text" placeholder="Nom complet" required />
      
      <input v-model="form.email" type="email" placeholder="Email" required />
      
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="Mot de passe" 
        required 
      />

      <select v-model="form.role">
        <option value="participant">Participant</option>
        <option value="organizer">Organisateur</option>
      </select>
      
      <button type="submit">Créer mon compte</button>
    </form>
  </div>
</template>