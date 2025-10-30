const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Evaluation = sequelize.define('Evaluation', {
    note: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 20 }
    },
    commentaire: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, { timestamps: true });

module.exports = Evaluation;