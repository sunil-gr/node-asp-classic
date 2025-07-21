const express = require('express');
const router = express.Router();
const scormPackageController = require('../controllers/scormPackage.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/scorm-packages
// @desc    Get all SCORM packages
// @access  Private
router.get('/', authMiddleware, scormPackageController.getAllScormPackages);

// @route   POST api/scorm-packages
// @desc    Create a new SCORM package
// @access  Private
router.post('/', authMiddleware, scormPackageController.createScormPackage);

// @route   PUT api/scorm-packages/:id
// @desc    Update a SCORM package
// @access  Private
router.put('/:id', authMiddleware, scormPackageController.updateScormPackage);

// @route   DELETE api/scorm-packages/:id
// @desc    Delete a SCORM package
// @access  Private
router.delete('/:id', authMiddleware, scormPackageController.deleteScormPackage);

module.exports = router; 