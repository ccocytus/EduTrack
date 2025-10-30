const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Utilisateur = sequelize.define('Utilisateur', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    motDePasse: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        // les differents types d'utilisateurs
        type: DataTypes.ENUM('ADMIN', 'FORMATEUR', 'ETUDIANT'),
        allowNull: false,
        defaultValue: 'ETUDIANT'
    }
}, {
    timestamps: true 
});

module.exports = Utilisateur;