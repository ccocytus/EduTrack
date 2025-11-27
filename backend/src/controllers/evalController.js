const { Evaluation, Cours, Utilisateur } = require('../models');

// mettre une note (que les profs)
exports.ajouterNote = async (req, res) => {
    try {
        if (req.user.role !== 'FORMATEUR' && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: "Accès interdit" });
        }

        const { etudiantId, coursId, note, commentaire } = req.body;
        
        const evaluation = await Evaluation.create({
            etudiantId, coursId, note, commentaire
        });

        res.status(201).json({ message: "Note enregistrée !", evaluation });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// voir mes notes
exports.mesNotes = async (req, res) => {
    try {
        const notes = await Evaluation.findAll({
            where: { etudiantId: req.user.id },
            include: [{ model: Cours, as: 'cours', attributes: ['titre'] }]
        });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};