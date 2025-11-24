const express = require('express');
const router = express.Router();
const coursCtrl = require('../controllers/coursController');
const auth = require('../middleware/authMiddleware'); // protection des routes

// voir tous les cours
router.get('/', auth, coursCtrl.getAllCours);

// creer un cours
router.post('/', auth, coursCtrl.createCours);

// s'inscrire à un cours
router.post('/:id/inscription', auth, coursCtrl.inscrireCours);

// voir les inscriptions
router.get('/mes-inscriptions', auth, coursCtrl.getMesInscriptions);

module.exports = router;