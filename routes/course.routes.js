const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authMiddleware = require('../middleware/auth.middleware');

// @route   GET api/courses
// @desc    Get all courses with their SCORM packages
// @access  Private
router.get('/', authMiddleware, courseController.getAllCourses);

// @route   GET api/courses/:id
// @desc    Get a single course by ID
// @access  Private
router.get('/:id', authMiddleware, courseController.getCourseById);

// @route   POST api/courses
// @desc    Create a new course
// @access  Private
router.post('/', authMiddleware, courseController.createCourse);

// @route   POST api/courses/add-package
// @desc    Add a SCORM package to a course
// @access  Private
router.post('/add-package', authMiddleware, courseController.addPackageToCourse);

// @route   POST api/courses/remove-package
// @desc    Remove a SCORM package from a course
// @access  Private
router.post('/remove-package', authMiddleware, courseController.removePackageFromCourse);

// @route   PUT api/courses/:id
// @desc    Update a course
// @access  Private
router.put('/:id', authMiddleware, courseController.updateCourse);

// @route   DELETE api/courses/:id
// @desc    Delete a course
// @access  Private
router.delete('/:id', authMiddleware, courseController.deleteCourse);

module.exports = router; 