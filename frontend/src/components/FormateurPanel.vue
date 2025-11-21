<template>
  <div class="container">
    <h2 class="mb-xl text-primary">Espace Formateur</h2>
    <div class="grid-2">
      <!-- Créer un cours -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Créer un cours</h3>
        </div>
        <form @submit.prevent="creerCours" class="form">
          <div class="form-group">
            <label class="label">Titre du cours</label>
            <input 
              v-model="newCours.titre" 
              type="text" 
              placeholder="Ex: Introduction au Python" 
              class="input" 
              required 
            />
          </div>
          
          <div class="form-group">
            <label class="label">Description</label>
            <textarea 
              v-model="newCours.description" 
              placeholder="Objectifs, contenu, prérequis..." 
              class="textarea"
            ></textarea>
          </div>
          
          <button type="submit" class="btn btn-success w-full">
            Publier le cours
          </button>
        </form>
        
        <!-- Aperçu des cours créés -->
        <div v-if="coursList.length > 0" class="cours-apercu">
          <h4 class="mb-sm text-muted">Mes cours ({{ coursList.length }})</h4>
          <div v-for="c in coursList.slice(0, 3)" :key="c.id" class="cours-mini">
            <strong>{{ c.titre }}</strong>
            <small class="text-light">{{ formatDate(c.createdAt) }}</small>
          </div>
          <small v-if="coursList.length > 3" class="text-light">
            +{{ coursList.length - 3 }} autres cours...
          </small>
        </div>
      </div>

      <!-- Évaluer un étudiant -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Évaluer un étudiant</h3>
        </div>
        
        <form @submit.prevent="noterEtudiant" class="form">
          <div class="form-group">
            <label class="label">Cours concerné</label>
            <select v-model="noteForm.coursId" class="select" required>
              <option value="">-- Sélectionner un cours --</option>
              <option v-for="c in coursList" :key="c.id" :value="c.id">
                {{ c.titre }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label class="label">Étudiant à évaluer</label>
            <select v-model="noteForm.etudiantId" class="select" required :disabled="!noteForm.coursId">
              <option value="">
                {{ !noteForm.coursId ? '-- Sélectionner d\'abord un cours --' : '-- Sélectionner un étudiant --' }}
              </option>
              <option v-for="etu in etudiantsCoursFiltre" :key="etu.id" :value="etu.id">
                {{ etu.nom }} ({{ etu.email }})
              </option>
            </select>
            <small v-if="noteForm.coursId && etudiantsCoursFiltre.length === 0" class="text-muted">
              Aucun étudiant inscrit à ce cours.
            </small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="label">Note /20</label>
              <input 
                v-model="noteForm.note" 
                type="number" 
                step="0.5" 
                min="0" 
                max="20" 
                placeholder="15.5" 
                class="input" 
                required 
              />
            </div>
            <div class="form-group">
              <label class="label">Commentaire</label>
              <input 
                v-model="noteForm.commentaire" 
                type="text" 
                placeholder="Excellent travail..." 
                class="input"
              />
            </div>
          </div>

          <button type="submit" class="btn btn-primary w-full" :disabled="etudiantsCoursFiltre.length === 0">
            Enregistrer l'évaluation
          </button>
        </form>
        
        <!-- Stats -->
        <div v-if="etudiantsList.length > 0" class="stats-apercu">
          <h4 class="mb-sm text-muted">Statistiques</h4>
          <div class="stat-item">
            <span>Total étudiants:</span>
            <span class="badge badge-info">{{ etudiantsList.length }}</span>
          </div>
          <div class="stat-item">
            <span>Cours publiés:</span>
            <span class="badge badge-success">{{ coursList.length }}</span>
          </div>
          <div v-if="noteForm.coursId" class="stat-item">
            <span>Inscrits au cours:</span>
            <span class="badge badge-warning">{{ etudiantsCoursFiltre.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- modules qui arrivent bientot -->
    <div class="grid-2 mb-xl">
      <div class="card opacity-50">
        <h3>Gestion des Absences</h3>
        <p>Module de suivi des présences</p>
        <button @click="showComingSoon" class="btn btn-light w-full">
          Gérer (Bientôt)
        </button>
      </div>

      <div class="card opacity-50">
        <h3>Messagerie</h3>
        <p>Contacter les étudiants</p>
        <button @click="showComingSoon" class="btn btn-light w-full">
          Ouvrir (Bientôt)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import api from '../services/api';

const newCours = reactive({ titre: '', description: '' });
const noteForm = reactive({ etudiantId: '', coursId: '', note: '', commentaire: '' });

const coursList = ref([]);
const etudiantsList = ref([]);
const etudiantsCoursFiltre = ref([]); // etudiants du cours selectionne

// chargement des donnees
const fetchGlobalData = async () => {
  try {
    const resCours = await api.get('/cours');
    coursList.value = resCours.data;

    const resEtudiants = await api.get('/auth/etudiants');
    etudiantsList.value = resEtudiants.data;
  } catch (err) {
    console.error("erreur chargement donnees formateur", err);
  }
};

const creerCours = async () => {
  try {
    await api.post('/cours', newCours);
    alert('Cours publié !');
    newCours.titre = ''; 
    newCours.description = '';
    fetchGlobalData(); // rechargement de la liste
  } catch (err) { 
    alert('Erreur création'); 
  }
};

const noterEtudiant = async () => {
  try {
    await api.post('/evaluations', noteForm);
    alert('Note enregistrée !');
    noteForm.note = ''; 
    noteForm.commentaire = '';
  } catch (err) { 
    alert('Erreur: Vérifiez que cet étudiant est bien inscrit.'); 
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR');
};

// recuperation des etudiants du cours choisi
const fetchEtudiantsCours = async (coursId) => {
  if (!coursId) {
    etudiantsCoursFiltre.value = [];
    return;
  }
  
  try {
    const res = await api.get(`/auth/etudiants-cours/${coursId}`);
    etudiantsCoursFiltre.value = res.data;
  } catch (err) {
    console.error("erreur recupération etudiants du cours:", err);
    etudiantsCoursFiltre.value = [];
  }
};

// surveillance du changement de cours
watch(() => noteForm.coursId, (newCoursId) => {
  fetchEtudiantsCours(newCoursId);
});

const showComingSoon = () => {
  alert('Module disponible dans la version 2.0');
};

onMounted(fetchGlobalData);
</script>

<style scoped>
/* styles pour ce composant */
.cours-apercu, .stats-apercu {
  margin-top: var(--space-lg);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-light);
}

.cours-mini {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--border-light);
}

.cours-mini:last-child {
  border-bottom: none;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-xs) 0;
}

.card {
  transition: var(--transition);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.opacity-50 {
  opacity: 0.5;
}

.opacity-50:hover {
  opacity: 0.7;
  transform: none;
}
</style>