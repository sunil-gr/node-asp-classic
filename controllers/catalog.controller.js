const { Catalog, Customer, Course, User } = require('../models');

// @desc    Get all catalogs for the logged-in user's customer
exports.getAllCatalogs = async (req, res) => {
    try {
        // The user's ID is attached to the request by the auth middleware
        const user = await User.findByPk(req.user.id);
        if (!user || !user.customerId) {
            return res.status(403).json({ message: 'User is not associated with a customer.' });
        }

        const catalogs = await Catalog.findAll({
            where: { customerId: user.customerId },
            include: { 
                model: Customer,
                attributes: ['name', 'type']
            }
        });
        res.status(200).json(catalogs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching catalogs', error: error.message });
    }
};

// @desc    Get a single catalog by ID
exports.getCatalogById = async (req, res) => {
    try {
        const catalog = await Catalog.findByPk(req.params.id, {
            include: [
                { model: Customer },
                { model: Course, as: 'Versions' }
            ]
        });
        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching catalog', error: error.message });
    }
};

// @desc    Add a version (course) to a catalog
exports.addVersionToCatalog = async (req, res) => {
    try {
        const { catalogId, courseId } = req.body;
        const catalog = await Catalog.findByPk(catalogId);
        const course = await Course.findByPk(courseId);

        if (!catalog || !course) {
            return res.status(404).json({ message: 'Catalog or Course not found' });
        }
        
        await catalog.addVersion(course); // `addVersion` is a magic method from Sequelize

        res.status(200).json({ message: 'Version added to catalog successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding version to catalog', error: error.message });
    }
};

// @desc    Remove a version (course) from a catalog
exports.deleteVersionFromCatalog = async (req, res) => {
    try {
        const { catalogId, courseId } = req.body;
        const catalog = await Catalog.findByPk(catalogId);
        const course = await Course.findByPk(courseId);

        if (!catalog || !course) {
            return res.status(404).json({ message: 'Catalog or Course not found' });
        }

        await catalog.removeVersion(course); // `removeVersion` is a magic method

        res.status(200).json({ message: 'Version removed from catalog successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing version from catalog', error: error.message });
    }
};

// @desc    Create a new catalog for the logged-in user's customer
exports.createCatalog = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user || !user.customerId) {
            return res.status(403).json({ message: 'User is not associated with a customer.' });
        }

        const newCatalog = await Catalog.create({
            ...req.body,
            customerId: user.customerId // Automatically associate with the user's customer
        });
        res.status(201).json(newCatalog);
    } catch (error) {
        res.status(500).json({ message: 'Error creating catalog', error: error.message });
    }
};

// @desc    Update a catalog
exports.updateCatalog = async (req, res) => {
    try {
        const catalog = await Catalog.findByPk(req.params.id);
        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        await catalog.update(req.body);
        res.status(200).json(catalog);
    } catch (error) {
        res.status(500).json({ message: 'Error updating catalog', error: error.message });
    }
};

// @desc    Delete a catalog
exports.deleteCatalog = async (req, res) => {
    try {
        const catalog = await Catalog.findByPk(req.params.id);
        if (!catalog) {
            return res.status(404).json({ message: 'Catalog not found' });
        }
        await catalog.destroy();
        res.status(200).json({ message: 'Catalog deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting catalog', error: error.message });
    }
}; 