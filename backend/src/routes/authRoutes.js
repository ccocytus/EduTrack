const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');

router.post('/signup', authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/etudiants', auth, authCtrl.getAllEtudiants);
router.get('/etudiants-cours/:coursId', auth, authCtrl.getEtudiantsInscritsCours);

module.exports = router;