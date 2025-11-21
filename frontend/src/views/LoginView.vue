<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-header">
        <h1 class="app-title">EduTrack</h1>
        <h2 class="form-title">{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="form">
        <div v-if="!isLogin" class="form-group">
          <label class="label">Nom complet</label>
          <input v-model="form.nom" type="text" placeholder="John Doe" class="input" required />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label class="label">Rôle</label>
          <select v-model="form.role" class="select" required>
            <option value="ETUDIANT">Étudiant</option>
            <option value="FORMATEUR">Formateur</option>
          </select>
        </div>

        <div class="form-group">
          <label class="label">Email</label>
          <input v-model="form.email" type="email" placeholder="email@ecole.com" class="input" required />
        </div>

        <div class="form-group">
          <label class="label">Mot de passe</label>
          <input v-model="form.motDePasse" type="password" placeholder="••••••••" class="input" required />
        </div>

        <button type="submit" class="btn btn-primary w-full btn-lg">
          {{ isLogin ? 'Se connecter' : "S'inscrire" }}
        </button>
      </form>
      
      <div class="login-footer">
        <p @click="isLogin = !isLogin" class="switch-link">
          {{ isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter" }}
        </p>
        <div v-if="errorMsg" class="alert alert-warning">{{ errorMsg }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';
import api from '../services/api';

const authStore = useAuthStore();
const router = useRouter();

const isLogin = ref(true);
const errorMsg = ref('');

const form = reactive({
  nom: '',
  email: '',
  motDePasse: '',
  role: 'ETUDIANT'
});

const handleSubmit = async () => {
  errorMsg.value = '';
  try {
    if (isLogin.value) {
      // connexion
      await authStore.login(form.email, form.motDePasse);
      router.push('/dashboard'); // redirection vers dashboard
    } else {
      // inscription
      await api.post('/auth/signup', form);
      alert('Compte créé ! Connecte-toi maintenant.');
      isLogin.value = true; // retour au mode login
    }
  } catch (err) {
    errorMsg.value = err;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
}

.login-container {
  background: white;
  max-width: 400px;
  width: 100%;
  margin: var(--space-lg);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.login-header {
  background: var(--primary);
  color: white;
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
}

.app-title {
  margin: 0 0 var(--space-sm) 0;
  font-size: 2rem;
  font-weight: 700;
}

.form-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
}

.form {
  padding: var(--space-xl) var(--space-lg);
}

.login-footer {
  padding: 0 var(--space-lg) var(--space-xl) var(--space-lg);
}

.switch-link {
  text-align: center;
  color: var(--secondary);
  cursor: pointer;
  margin: 0 0 var(--space-md) 0;
  transition: var(--transition);
  font-weight: 500;
}

.switch-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

/* animation d'apparition */
.login-container {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* responsive mobile */
@media (max-width: 480px) {
  .login-container {
    margin: var(--space-sm);
    border-radius: var(--radius-sm);
  }
  
  .login-header {
    padding: var(--space-lg);
  }
  
  .app-title {
    font-size: 1.5rem;
  }
}
</style>