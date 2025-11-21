import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/global.css'; 

const app = createApp(App);

app.use(createPinia()); // activation de pinia pour le state
app.use(router);        // activation du router

app.mount('#app');