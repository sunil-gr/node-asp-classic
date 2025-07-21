const sequelize = require('../config/database');
const User = require('./user.model');
const UserSecurity = require('./userSecurity.model');
const Course = require('./course.model');
const ScormPackage = require('./scormPackage.model');
const Catalog = require('./catalog.model');
const Customer = require('./customer.model');

// Define relationships
User.hasOne(UserSecurity, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserSecurity.belongsTo(User, { foreignKey: 'userId' });

// User to Customer relationship
Customer.hasMany(User, { foreignKey: 'customerId' });
User.belongsTo(Customer, { foreignKey: 'customerId' });

Course.belongsToMany(ScormPackage, { through: 'CourseScormPackageXref' });
ScormPackage.belongsToMany(Course, { through: 'CourseScormPackageXref' });

Customer.hasMany(Catalog, { foreignKey: 'customerId' });
Catalog.belongsTo(Customer, { foreignKey: 'customerId' });

// Relationship between Catalogs and Courses (Versions)
Catalog.belongsToMany(Course, { as: 'Versions', through: 'CatalogCourseXref' });
Course.belongsToMany(Catalog, { through: 'CatalogCourseXref' });

const db = {
    sequelize,
    Sequelize: require('sequelize'),
    User,
    UserSecurity,
    Course,
    ScormPackage,
    Catalog,
    Customer
};

// Sync all models with the database
// In a production environment, you might use migrations instead of force: true
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Database & tables synced!');
});

module.exports = db; 