import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // adresse du backend
    headers: {
        'Content-Type': 'application/json'
    }
});

// ajout automatique du token dans toutes les requetes
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;