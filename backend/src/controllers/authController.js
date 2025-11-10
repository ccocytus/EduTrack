const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Utilisateur } = require('../models'); // import des models

// inscription pour creer des comptes
exports.register = async (req, res) => {
    try {
        const { nom, email, motDePasse, role } = req.body;
        
        // hachage du mot de passe sinon c'est pas secure
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const newUser = await Utilisateur.create({
            nom,
            email,
            motDePasse: hashedPassword,
            role: role || 'ETUDIANT' // par defaut c'est etudiant
        });

        res.status(201).json({ message: "Utilisateur créé !", userId: newUser.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// login pour se connecter
exports.login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body;

        // est ce que l'user existe
        const user = await Utilisateur.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // check du mot de passe
        const valid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // generation du token jwt
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            userId: user.id,
            token: token,
            role: user.role,
            nom: user.nom
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// recuperer tous les etudiants pour le formateur
exports.getAllEtudiants = async (req, res) => {
    try {
        const etudiants = await Utilisateur.findAll({
            where: { role: 'ETUDIANT' },
            attributes: ['id', 'nom', 'email'] // pas le mot de passe bien sur 
        });
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// avoir que les etudiants inscrits a un cours specifique
exports.getEtudiantsInscritsCours = async (req, res) => {
    try {
        const coursId = req.params.coursId;
        const { Inscription } = require('../models');
        
        const etudiants = await Utilisateur.findAll({
            where: { role: 'ETUDIANT' },
            attributes: ['id', 'nom', 'email'],
            include: [{
                model: Inscription,
                where: { coursId },
                attributes: ['dateInscription']
            }]
        });
        
        res.status(200).json(etudiants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};