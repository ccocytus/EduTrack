<template>
  <div class="app-layout">
    <nav class="navbar">
      <div class="container">
        <div class="flex-between">
          <div class="logo">EduTrack</div>
          <div class="user-menu">
            <span class="user-name">{{ authStore.user?.nom }}</span>
            <span class="badge badge-light">{{ authStore.user?.role }}</span>
            <button @click="logout" class="btn btn-danger btn-sm">Déconnexion</button>
          </div>
        </div>
      </div>
    </nav>

    <main class="main-content">
      <FormateurPanel v-if="authStore.isFormateur" />
      <EtudiantPanel v-else />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import FormateurPanel from '../components/FormateurPanel.vue';
import EtudiantPanel from '../components/EtudiantPanel.vue';

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.push('/');
};
</script>

<style scoped>
/* styles navbar */
.navbar { 
  background: var(--primary); 
  color: white; 
  padding: var(--space-md) 0;
  box-shadow: var(--shadow);
}

.logo { 
  font-size: 1.5rem; 
  font-weight: 700; 
  color: white;
}

.user-menu { 
  display: flex; 
  align-items: center; 
  gap: var(--space-md); 
}

.user-name {
  font-weight: 500;
}

.main-content { 
  padding: var(--space-xl) 0; 
}
</style>