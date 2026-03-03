<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/axios'
import type { User } from '@/types/user'

const users = ref<User[]>([])
const loading = ref(true)

const fetchUsers = async () => {
  try {
    const response = await api.get('/users')
    users.value = response.data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    alert('Erreur lors de la récupération des utilisateurs')
  } finally {
    loading.value = false
  }
}

const deleteUser = async (id: string) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
    try {
      await api.delete(`/users/${id}`)
      users.value = users.value.filter((u) => u._id !== id)
      alert('Utilisateur supprimé')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur lors de la suppression')
    }
  }
}

onMounted(fetchUsers)
</script>

<template>
  <div class="admin-container">
    <h1>Gestion des Utilisateurs</h1>

    <div v-if="loading">Chargement...</div>

    <table v-else class="user-table">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user._id">
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span :class="['badge', user.role]">{{ user.role }}</span>
          </td>
          <td>
            <button v-if="user.role !== 'admin'" @click="deleteUser(user._id)" class="delete-btn">
              Supprimer
            </button>
            <span v-else>--</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.user-table th,
.user-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}
.badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8em;
  text-transform: uppercase;
}
.badge.admin {
  background: #e74c3c;
  color: white;
}
.badge.organizer {
  background: #f39c12;
  color: white;
}
.badge.participant {
  background: #3498db;
  color: white;
}
.delete-btn {
  background: #ff4757;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
}
.delete-btn:hover {
  background: #ff6b81;
}
</style>
