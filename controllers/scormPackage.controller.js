const { ScormPackage } = require('../models');

// @desc    Get all SCORM packages
exports.getAllScormPackages = async (req, res) => {
    try {
        const packages = await ScormPackage.findAll();
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching SCORM packages', error: error.message });
    }
};

// @desc    Create a new SCORM package
exports.createScormPackage = async (req, res) => {
    try {
        const newPackage = await ScormPackage.create(req.body);
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: 'Error creating SCORM package', error: error.message });
    }
};

// @desc    Update a SCORM package
exports.updateScormPackage = async (req, res) => {
    try {
        const pkg = await ScormPackage.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ message: 'SCORM package not found' });
        }
        await pkg.update(req.body);
        res.status(200).json(pkg);
    } catch (error) {
        res.status(500).json({ message: 'Error updating SCORM package', error: error.message });
    }
};

// @desc    Delete a SCORM package
exports.deleteScormPackage = async (req, res) => {
    try {
        const pkg = await ScormPackage.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ message: 'SCORM package not found' });
        }
        await pkg.destroy();
        res.status(200).json({ message: 'SCORM package deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting SCORM package', error: error.message });
    }
}; 