// routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateJWT, authorizeAdmin } = require('../middleware/authMiddleware');

// --- Create a New Course (Admin Only) ---
// POST /api/courses
router.post('/', authenticateJWT, authorizeAdmin, async (req, res) => {
    const { course_code, course_name, description, credits, tuition_fees, capacity } = req.body;

    if (!course_code || !course_name || credits === undefined || tuition_fees === undefined || capacity === undefined) {
        return res.status(400).json({ msg: 'Please provide course_code, course_name, credits, tuition_fees, and capacity.' });
    }
    if (credits < 0 || tuition_fees < 0 || capacity < 0) {
        return res.status(400).json({ msg: 'Credits, tuition fees, and capacity cannot be negative.' });
    }

    try {
        const result = await pool.query(
            'INSERT INTO courses (course_code, course_name, description, credits, tuition_fees, capacity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [course_code, course_name, description, credits, tuition_fees, capacity]
        );
        res.status(201).json({ msg: 'Course created successfully', course: result.rows[0] });
    } catch (err) {
        console.error('Error creating course:', err.message);
        if (err.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ msg: 'Course with that code already exists.' });
        }
        res.status(500).json({ msg: 'Server error creating course.' });
    }
});

// --- Get All Courses (Accessible to all authenticated users) ---
// GET /api/courses
router.get('/', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM courses ORDER BY course_code ASC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching all courses:', err.message);
        res.status(500).json({ msg: 'Server error fetching courses.' });
    }
});

// --- Get Course By ID (Accessible to all authenticated users) ---
// GET /api/courses/:id
router.get('/:id', authenticateJWT, async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const result = await pool.query('SELECT * FROM courses WHERE course_id = $1', [courseId]);
        const course = result.rows[0];

        if (!course) {
            return res.status(404).json({ msg: 'Course not found.' });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error('Error fetching course by ID:', err.message);
        res.status(500).json({ msg: 'Server error fetching course.' });
    }
});

// --- Update Course Details (Admin Only) ---
// PUT /api/courses/:id
router.put('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    const courseId = parseInt(req.params.id);
    const { course_code, course_name, description, credits, tuition_fees, capacity } = req.body;

    // Basic validation
    if (credits !== undefined && credits < 0 || tuition_fees !== undefined && tuition_fees < 0 || capacity !== undefined && capacity < 0) {
        return res.status(400).json({ msg: 'Credits, tuition fees, and capacity cannot be negative.' });
    }

    try {
        const result = await pool.query(
            `UPDATE courses SET
                course_code = COALESCE($1, course_code),
                course_name = COALESCE($2, course_name),
                description = COALESCE($3, description),
                credits = COALESCE($4, credits),
                tuition_fees = COALESCE($5, tuition_fees),
                capacity = COALESCE($6, capacity)
            WHERE course_id = $7
            RETURNING *`,
            [course_code, course_name, description, credits, tuition_fees, capacity, courseId]
        );
        const updatedCourse = result.rows[0];

        if (!updatedCourse) {
            return res.status(404).json({ msg: 'Course not found or nothing to update.' });
        }
        res.status(200).json({ msg: 'Course updated successfully', course: updatedCourse });
    } catch (err) {
        console.error('Error updating course:', err.message);
        if (err.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ msg: 'Course with that code already exists.' });
        }
        res.status(500).json({ msg: 'Server error updating course.' });
    }
});

// --- Delete Course (Admin Only) ---
// DELETE /api/courses/:id
router.delete('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    const courseId = parseInt(req.params.id);
    try {
        const result = await pool.query('DELETE FROM courses WHERE course_id = $1 RETURNING course_id', [courseId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Course not found.' });
        }
        res.status(200).json({ msg: 'Course deleted successfully.' });
    } catch (err) {
        console.error('Error deleting course:', err.message);
        res.status(500).json({ msg: 'Server error deleting course.' });
    }
});

module.exports = router;