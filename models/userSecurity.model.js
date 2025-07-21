const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserSecurity = sequelize.define('UserSecurity', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // 'Users' is the table name for the User model
            key: 'id'
        }
    },
    forcePasswordReset: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lastForcePasswordResetDate: {
        type: DataTypes.DATE
    },
    isLocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    lockDate: {
        type: DataTypes.DATE
    },
    loginAttempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = UserSecurity; 