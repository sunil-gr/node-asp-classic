const { Course, ScormPackage } = require('../models');

// @desc    Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll({
            include: [{
                model: ScormPackage,
                attributes: ['id', 'title'], // Only get ID and title
                through: { attributes: [] } // Don't include the association table attributes
            }]
        });
        res.status(200).json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

// @desc    Get a single course by ID
exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id, {
            include: [{
                model: ScormPackage,
                attributes: ['id', 'title'],
                through: { attributes: [] }
            }]
        });
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching course', error: error.message });
    }
};

// @desc    Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);
        res.status(201).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
};

// @desc    Add a SCORM package to a course
exports.addPackageToCourse = async (req, res) => {
    try {
        const { courseId, scormPackageId } = req.body;
        const course = await Course.findByPk(courseId);
        const scormPackage = await ScormPackage.findByPk(scormPackageId);

        if (!course || !scormPackage) {
            return res.status(404).json({ message: 'Course or SCORM package not found' });
        }

        await course.addScormPackage(scormPackage);
        res.status(200).json({ message: 'SCORM package added to course successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error adding package to course', error: error.message });
    }
};

// @desc    Remove a SCORM package from a course
exports.removePackageFromCourse = async (req, res) => {
    try {
        const { courseId, scormPackageId } = req.body;
        const course = await Course.findByPk(courseId);
        const scormPackage = await ScormPackage.findByPk(scormPackageId);

        if (!course || !scormPackage) {
            return res.status(404).json({ message: 'Course or SCORM package not found' });
        }

        await course.removeScormPackage(scormPackage);
        res.status(200).json({ message: 'SCORM package removed from course successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Error removing package from course', error: error.message });
    }
};

// @desc    Update a course
exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.update(req.body);
        res.status(200).json(course);
    } catch (error) {
        res.status(500).json({ message: 'Error updating course', error: error.message });
    }
};

// @desc    Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        await course.destroy();
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
}; 