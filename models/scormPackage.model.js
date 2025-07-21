const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ScormPackage = sequelize.define('ScormPackage', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    scoObjectId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        defaultValue: 'ScoObjects'
    },
    pathType: {
        type: DataTypes.STRING,
        defaultValue: 'relative'
    },
    scoContainerName: {
        type: DataTypes.STRING
    },
    scoEntryFile: {
        type: DataTypes.STRING,
        defaultValue: 'index_lms.html'
    },
    launchData: {
        type: DataTypes.STRING
    },
    masteryScore: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = ScormPackage; 