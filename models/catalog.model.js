const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Catalog = sequelize.define('Catalog', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sku: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.TEXT
    },
    isDefault: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    customerName: {
        type: DataTypes.STRING
    },
    customerType: {
        type: DataTypes.STRING
    }
});

module.exports = Catalog; 