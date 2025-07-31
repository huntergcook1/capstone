// routes/studentCourseRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateJWT, authorizeAdmin, authorizeStudent } = require('../middleware/authMiddleware');

// --- Register a student for a course ---
// POST /api/student-courses/register
// Student can register themselves, Admin can register any student
router.post('/register', authenticateJWT, async (req, res) => {
    const { user_id, course_id } = req.body; // user_id might be provided by frontend or determined by JWT
    const requestingUserId = req.user.user_id;
    const requestingUserRole = req.user.role;

    let targetUserId = user_id;

    // If student, they can only register themselves
    if (requestingUserRole === 'student') {
        if (user_id && user_id !== requestingUserId) {
            return res.status(403).json({ msg: 'Forbidden: Students can only register themselves for courses.' });
        }
        targetUserId = requestingUserId; // Ensure student registers themselves
    } else if (requestingUserRole === 'admin') {
        // Admin can register any user, but user_id must be provided in body
        if (!user_id) {
            return res.status(400).json({ msg: 'Admin must provide user_id for registration.' });
        }
    } else {
        return res.status(403).json({ msg: 'Forbidden: Invalid user role.' });
    }

    if (!course_id) {
        return res.status(400).json({ msg: 'Please provide course_id for registration.' });
    }

    try {
        // Check if course exists and its capacity
        const courseResult = await pool.query('SELECT course_name, capacity FROM courses WHERE course_id = $1', [course_id]);
        const course = courseResult.rows[0];

        if (!course) {
            return res.status(404).json({ msg: 'Course not found.' });
        }

        // Check current enrollment
        const enrollmentCountResult = await pool.query('SELECT COUNT(*) FROM student_courses WHERE course_id = $1', [course_id]);
        const currentEnrollment = parseInt(enrollmentCountResult.rows[0].count);

        if (currentEnrollment >= course.capacity) {
            return res.status(400).json({ msg: 'Course is full. Cannot register.' });
        }

        // Check if student is already registered for this course
        const alreadyRegistered = await pool.query('SELECT * FROM student_courses WHERE user_id = $1 AND course_id = $2', [targetUserId, course_id]);
        if (alreadyRegistered.rows.length > 0) {
            return res.status(400).json({ msg: 'Student is already registered for this course.' });
        }

        // Check if target user exists and is a student
        const targetUserResult = await pool.query('SELECT role FROM users WHERE user_id = $1', [targetUserId]);
        const targetUser = targetUserResult.rows[0];
        if (!targetUser || targetUser.role !== 'student') {
            return res.status(400).json({ msg: 'Cannot register for non-existent or non-student user.' });
        }


        // Register student for the course
        const result = await pool.query(
            'INSERT INTO student_courses (user_id, course_id) VALUES ($1, $2) RETURNING *',
            [targetUserId, course_id]
        );
        res.status(201).json({ msg: 'Successfully registered for course.', registration: result.rows[0] });

    } catch (err) {
        console.error('Error during course registration:', err.message);
        res.status(500).json({ msg: 'Server error during course registration.' });
    }
});

// --- Unregister a student from a course ---
// DELETE /api/student-courses/unregister
// Student can unregister themselves, Admin can unregister any student
router.delete('/unregister', authenticateJWT, async (req, res) => {
    const { user_id, course_id } = req.body; // user_id might be provided by frontend or determined by JWT
    const requestingUserId = req.user.user_id;
    const requestingUserRole = req.user.role;

    let targetUserId = user_id;

    // If student, they can only unregister themselves
    if (requestingUserRole === 'student') {
        if (user_id && user_id !== requestingUserId) {
            return res.status(403).json({ msg: 'Forbidden: Students can only unregister themselves from courses.' });
        }
        targetUserId = requestingUserId; // Ensure student unregisters themselves
    } else if (requestingUserRole === 'admin') {
        // Admin can unregister any user, but user_id must be provided in body
        if (!user_id) {
            return res.status(400).json({ msg: 'Admin must provide user_id for unregistration.' });
        }
    } else {
        return res.status(403).json({ msg: 'Forbidden: Invalid user role.' });
    }

    if (!course_id) {
        return res.status(400).json({ msg: 'Please provide course_id for unregistration.' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM student_courses WHERE user_id = $1 AND course_id = $2 RETURNING *',
            [targetUserId, course_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'Student not registered for this course.' });
        }
        res.status(200).json({ msg: 'Successfully unregistered from course.', unregistration: result.rows[0] });

    } catch (err) {
        console.error('Error during course unregistration:', err.message);
        res.status(500).json({ msg: 'Server error during course unregistration.' });
    }
});

// --- Get a Student's Registered Courses (for Profile Page) ---
// GET /api/student-courses/:user_id/registered-courses
// Admin can view any student's courses, Student can view their own
router.get('/:user_id/registered-courses', authenticateJWT, async (req, res) => {
    const studentId = parseInt(req.params.user_id);
    const requestingUserId = req.user.user_id;
    const requestingUserRole = req.user.role;

    // Authorization check: Admin can view any, student can view only their own
    if (requestingUserRole === 'student' && studentId !== requestingUserId) {
        return res.status(403).json({ msg: 'Forbidden: Students can only view their own registered courses.' });
    }

    try {
        const result = await pool.query(
            `SELECT
                sc.registration_date,
                c.course_id,
                c.course_code,
                c.course_name,
                c.description,
                c.credits,
                c.tuition_fees
            FROM student_courses sc
            JOIN courses c ON sc.course_id = c.course_id
            WHERE sc.user_id = $1
            ORDER BY c.course_code ASC`,
            [studentId]
        );

        // Calculate total credits and tuition fees
        let totalCredits = 0;
        let totalTuitionFees = 0;
        result.rows.forEach(course => {
            totalCredits += parseFloat(course.credits);
            totalTuitionFees += parseFloat(course.tuition_fees);
        });

        res.status(200).json({
            student_id: studentId,
            registered_courses: result.rows,
            total_credits: totalCredits.toFixed(1), // Format to 1 decimal place
            total_tuition_fees: totalTuitionFees.toFixed(2) // Format to 2 decimal places
        });

    } catch (err) {
        console.error('Error fetching student registered courses:', err.message);
        res.status(500).json({ msg: 'Server error fetching registered courses.' });
    }
});

// --- Get All Registered Students for a Course (Admin Only, for Course Overview) ---
// GET /api/student-courses/:course_id/registered-students
router.get('/:course_id/registered-students', authenticateJWT, authorizeAdmin, async (req, res) => {
    const courseId = parseInt(req.params.course_id);

    try {
        const result = await pool.query(
            `SELECT
                sc.registration_date,
                u.user_id,
                u.username,
                u.email,
                u.first_name,
                u.last_name
            FROM student_courses sc
            JOIN users u ON sc.user_id = u.user_id
            WHERE sc.course_id = $1
            ORDER BY u.last_name, u.first_name ASC`,
            [courseId]
        );

        res.status(200).json({
            course_id: courseId,
            registered_students: result.rows
        });

    } catch (err) {
        console.error('Error fetching registered students for course:', err.message);
        res.status(500).json({ msg: 'Server error fetching registered students.' });
    }
});


module.exports = router;