import { defineStore } from 'pinia';
import api from '../services/api';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null
    }),
    getters: {
        isAuthenticated: (state) => !!state.token,
        isFormateur: (state) => state.user?.role === 'FORMATEUR' || state.user?.role === 'ADMIN'
    },
    actions: {
        async login(email, motDePasse) {
            try {
                // appel de l'api login
                const response = await api.post('/auth/login', { email, motDePasse });
                
                // stockage des infos
                this.token = response.data.token;
                this.user = { 
                    id: response.data.userId, 
                    role: response.data.role, 
                    nom: response.data.nom 
                };

                // sauvegarde dans le navigateur
                localStorage.setItem('token', this.token);
                localStorage.setItem('user', JSON.stringify(this.user));
                
                return true; // connexion reussie
            } catch (error) {
                console.error("Erreur login:", error.response?.data?.error);
                throw error.response?.data?.error || "Erreur de connexion";
            }
        },
        logout() {
            this.token = null;
            this.user = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    }
});