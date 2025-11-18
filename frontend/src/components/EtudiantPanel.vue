<template>
  <div class="container">
    <!-- Notes Section -->
    <section class="mb-xl">
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Mes Résultats</h2>
        </div>
        
        <div v-if="mesNotes.length === 0" class="alert alert-info">
          <p>Aucune note reçue pour l'instant. Vos évaluations apparaîtront ici.</p>
        </div>
        
        <div v-else>
          <div class="grid-3 mb-md">
            <div v-for="note in mesNotes" :key="note.id" class="card note-item">
              <div class="flex-between mb-sm">
                <span class="font-bold">{{ note.cours?.titre }}</span>
                <span class="badge" :class="`badge-${getColor(note.note)}`">
                  {{ note.note }}/20
                </span>
              </div>
              <p v-if="note.commentaire" class="text-muted">
                "{{ note.commentaire }}"
              </p>
            </div>
          </div>
          
          <!-- Moyenne -->
          <div v-if="mesNotes.length > 1" class="alert alert-success">
            <strong>Moyenne générale: {{ calculateAverage() }}/20</strong>
          </div>
        </div>
      </div>
    </section>

    <!-- Cours Section -->
    <section>
      <div class="card">
        <div class="card-header">
          <h2 class="card-title">Cours Disponibles</h2>
        </div>
        
        <div v-if="coursList.length === 0" class="alert alert-info">
          <p>Aucun cours disponible pour le moment.</p>
        </div>
        
        <div v-else class="flex-col" style="gap: var(--space-md)">
          <div v-for="cours in coursList" :key="cours.id" class="card cours-item">
            <div class="flex-between">
              <div class="cours-content">
                <h3 class="m-0 mb-xs text-primary">{{ cours.titre }}</h3>
                <p class="m-0 mb-xs text-muted">{{ cours.description }}</p>
                <small class="text-light">Formateur: {{ cours.formateur?.nom }}</small>
              </div>
              
              <div class="cours-actions">
                <button 
                  v-if="estInscrit(cours.id)" 
                  class="btn btn-light" 
                  disabled
                >
                 Déjà Inscrit
                </button>
                <button 
                  v-else 
                  @click="rejoindre(cours.id)" 
                  class="btn btn-success"
                >
                  S'inscrire
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- modules qui arrivent bientot -->
    <section class="mb-xl">
      <div class="grid-1">
        <div class="card opacity-50">
          <h3>Messagerie</h3>
          <p>Consulter mes messages</p>
          <button @click="showComingSoon" class="btn btn-light w-full">
            Voir Messagerie (Bientôt)
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const mesNotes = ref([]);
const coursList = ref([]);
const mesInscriptions = ref([]); // cours ou l'etudiant est inscrit

const fetchData = async () => {
  try {
    // recuperation des notes
    const resNotes = await api.get('/evaluations/mes-notes');
    mesNotes.value = resNotes.data;

    // recuperation de tous les cours
    const resCours = await api.get('/cours');
    coursList.value = resCours.data;

    // recuperation des inscriptions
    const resInscriptions = await api.get('/cours/mes-inscriptions');
    mesInscriptions.value = resInscriptions.data.map(inscription => inscription.coursId);
    
  } catch (err) { console.error(err); }
};

const estInscrit = (coursId) => {
  // verification si deja inscrit au cours
  return mesInscriptions.value.includes(coursId);
};

const rejoindre = async (id) => {
  try {
    await api.post(`/cours/${id}/inscription`);
    mesInscriptions.value.push(id); // mise a jour immediate
    alert('Inscription validée !');
  } catch (err) {
    if(err.response?.status === 400) {
      mesInscriptions.value.push(id);
    } else {
      alert('Erreur inscription');
    }
  }
};

const getColor = (n) => n >= 15 ? 'success' : (n >= 10 ? 'warning' : 'danger');

const calculateAverage = () => {
  if (mesNotes.value.length === 0) return '0.0';
  const sum = mesNotes.value.reduce((acc, note) => acc + note.note, 0);
  return (sum / mesNotes.value.length).toFixed(1);
};

const showComingSoon = () => {
  alert('Module disponible dans la version 2.0');
};

onMounted(fetchData);
</script>

<style scoped>
.note-item {
  border-left: 4px solid var(--border);
  transition: var(--transition);
}

.note-item:hover {
  border-left-color: var(--secondary);
  transform: translateY(-2px);
}

.cours-item {
  transition: var(--transition);
}

.cours-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

@media (max-width: 768px) {
  .cours-item .flex-between {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-md);
  }
  
  .cours-actions {
    width: 100%;
  }
  
  .cours-actions .btn {
    width: 100%;
  }
}

.opacity-50 {
  opacity: 0.5;
}

.opacity-50:hover {
  opacity: 0.7;
  transform: none;
}
</style>