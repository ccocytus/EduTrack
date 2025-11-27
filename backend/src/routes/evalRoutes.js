const express = require('express');
const router = express.Router();
const evalCtrl = require('../controllers/evalController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, evalCtrl.ajouterNote);
router.get('/mes-notes', auth, evalCtrl.mesNotes);

module.exports = router;