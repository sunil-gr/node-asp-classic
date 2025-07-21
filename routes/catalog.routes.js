const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalog.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/catalogs
// @desc    Get all catalogs
// @access  Private
router.get('/', authMiddleware, catalogController.getAllCatalogs);

// @route   GET api/catalogs/:id
// @desc    Get a single catalog by ID
// @access  Private
router.get('/:id', authMiddleware, catalogController.getCatalogById);

// @route   POST api/catalogs/add-version
// @desc    Add a version (course) to a catalog
// @access  Private
router.post('/add-version', authMiddleware, catalogController.addVersionToCatalog);

// @route   DELETE api/catalogs/delete-version
// @desc    Remove a version (course) from a catalog
// @access  Private
router.delete('/delete-version', authMiddleware, catalogController.deleteVersionFromCatalog);

// @route   POST api/catalogs
// @desc    Create a new catalog
// @access  Private
router.post('/', authMiddleware, catalogController.createCatalog);

// @route   PUT api/catalogs/:id
// @desc    Update a catalog
// @access  Private
router.put('/:id', authMiddleware, catalogController.updateCatalog);

// @route   DELETE api/catalogs/:id
// @desc    Delete a catalog
// @access  Private
router.delete('/:id', authMiddleware, catalogController.deleteCatalog);

module.exports = router; 