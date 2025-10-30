const express = require('express');
const cors = require('cors');
const db = require('./src/models');
require('dotenv').config();

// importations des routes
const authRoutes = require('./src/routes/authRoutes');
const coursRoutes = require('./src/routes/coursRoutes');
const evalRoutes = require('./src/routes/evalRoutes');


const app = express();

app.use(cors());
app.use(express.json());

// enregistrement des routes
app.use('/api/auth', authRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/evaluations', evalRoutes);

const PORT = process.env.PORT || 3000;

db.sequelize.sync({ alter: true }).then(() => {
    console.log('Base de données synchronisée');
    app.listen(PORT, () => {
        console.log(`Serveur démarré sur http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('Erreur DB:', err);
});