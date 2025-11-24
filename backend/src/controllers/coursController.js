const { Cours, Utilisateur, Inscription } = require('../models');

// avoir tous les cours disponibles
exports.getAllCours = async (req, res) => {
    try {
        const cours = await Cours.findAll({
            include: [{ model: Utilisateur, as: 'formateur', attributes: ['nom'] }]
        });
        res.status(200).json(cours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// creer un cours (que les profs)
exports.createCours = async (req, res) => {
    try {
        if (req.user.role === 'ETUDIANT') {
            return res.status(403).json({ error: "Seuls les formateurs peuvent créer des cours." });
        }

        const { titre, description } = req.body;
        
        const newCours = await Cours.create({
            titre,
            description,
            formateurId: req.user.id // l'id qui vient du token
        });

        res.status(201).json({ message: "Cours créé avec succès !", cours: newCours });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// s'inscrire a un cours
exports.inscrireCours = async (req, res) => {
    try {
        const etudiantId = req.user.id;
        const coursId = req.params.id; // id du cours dans l'url

        // check si il est deja inscrit
        const existingInscription = await Inscription.findOne({
            where: { etudiantId, coursId }
        });

        if (existingInscription) {
            return res.status(400).json({ message: "Déjà inscrit à ce cours." });
        }

        // creation de l'inscription
        await Inscription.create({
            etudiantId,
            coursId
        });

        res.status(201).json({ message: "Inscription validée !" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// recuperer mes inscriptions
exports.getMesInscriptions = async (req, res) => {
    try {
        const etudiantId = req.user.id;
        
        const inscriptions = await Inscription.findAll({
            where: { etudiantId },
            include: [{ 
                model: Cours, 
                as: 'cours', 
                attributes: ['id', 'titre', 'description'],
                include: [{ 
                    model: Utilisateur, 
                    as: 'formateur', 
                    attributes: ['nom'] 
                }]
            }]
        });
        
        res.status(200).json(inscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};