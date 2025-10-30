const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Utilisateur = require('./Utilisateur');
const Cours = require('./Cours');
const Evaluation = require('./Evaluation');

// relations cours formateur
Utilisateur.hasMany(Cours, { foreignKey: 'formateurId', as: 'coursEnseignes' });
Cours.belongsTo(Utilisateur, { foreignKey: 'formateurId', as:'formateur' });

// table inscription etudiant cours
const Inscription = sequelize.define('Inscription', {
    dateInscription: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, { timestamps: false });

Utilisateur.belongsToMany(Cours, { through: Inscription, foreignKey: 'etudiantId', as: 'coursSuivis' });
Cours.belongsToMany(Utilisateur, { through: Inscription, foreignKey: 'coursId', as: 'etudiantsInscrits' });

// relations avec la table inscription
Inscription.belongsTo(Utilisateur, { foreignKey: 'etudiantId', as: 'etudiant' });
Inscription.belongsTo(Cours, { foreignKey: 'coursId', as: 'cours' });
Utilisateur.hasMany(Inscription, { foreignKey: 'etudiantId' });
Cours.hasMany(Inscription, { foreignKey: 'coursId' });

// relations pour les evaluations
// une evaluation appartient à un etudiant et concerne un cours
Evaluation.belongsTo(Utilisateur, { foreignKey: 'etudiantId', as: 'etudiant' });
Evaluation.belongsTo(Cours, { foreignKey: 'coursId', as: 'cours' });

Utilisateur.hasMany(Evaluation, { foreignKey: 'etudiantId' });
Cours.hasMany(Evaluation, { foreignKey: 'coursId' });

const db = { sequelize, Utilisateur, Cours, Inscription, Evaluation };
module.exports = db;