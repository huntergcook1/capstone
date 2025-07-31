// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const { authenticateJWT, authorizeAdmin } = require('../middleware/authMiddleware');

// --- Get All Users (Admin Only) with Optional Search/Filter ---
// GET /api/users?search=<keyword>&role=<role_name>
router.get('/', authenticateJWT, authorizeAdmin, async (req, res) => {
    const { search, role } = req.query; // Get query parameters

    let query = 'SELECT user_id, username, email, first_name, last_name, telephone, address, role FROM users';
    const queryParams = [];
    const conditions = [];
    let paramIndex = 1;

    // Add search condition
    // Searches username, email, first_name, last_name (case-insensitive)
    if (search) {
        conditions.push(`(username ILIKE $${paramIndex} OR email ILIKE $${paramIndex} OR first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex})`);
        queryParams.push(`%${search}%`); // ILIKE for case-insensitive partial match
        paramIndex++;
    }

    // Add role filter condition
    if (role) {
        conditions.push(`role = $${paramIndex}`);
        queryParams.push(role);
        paramIndex++;
    }

    // Combine all conditions with 'AND'
    if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY user_id ASC'; // Always order for consistent results

    try {
        const result = await pool.query(query, queryParams);
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching all users with filters:', err.message);
        res.status(500).json({ msg: 'Server error fetching users.' });
    }
});

// --- Get User By ID (Admin Only, or User accessing their own profile) ---
// GET /api/users/:id
router.get('/:id', authenticateJWT, async (req, res) => {
    const userId = parseInt(req.params.id);

    // Allow user to get their own profile, or admin to get any profile
    if (req.user.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden: You can only view your own profile unless you are an admin.' });
    }

    try {
        const result = await pool.query(
            'SELECT user_id, username, email, first_name, last_name, telephone, address, role FROM users WHERE user_id = $1',
            [userId]
        );
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (err) {
        console.error('Error fetching user by ID:', err.message);
        res.status(500).json({ msg: 'Server error fetching user.' });
    }
});

// --- Update User Details (Admin can update any, User can update own) ---
// PUT /api/users/:id
router.put('/:id', authenticateJWT, async (req, res) => {
    const userId = parseInt(req.params.id);
    const { username, email, first_name, last_name, telephone, address, role, password } = req.body;

    // Only allow specific fields to be updated by non-admins
    if (req.user.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden: You can only update your own profile unless you are an admin.' });
    }

    // Admins can change roles, non-admins cannot.
    // If a non-admin tries to send a 'role' in the body, ignore it or reject.
    if (role && req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Forbidden: You cannot change user roles.' });
    }

    try {
        let updateQuery = `
            UPDATE users SET
                username = COALESCE($1, username),
                email = COALESCE($2, email),
                first_name = COALESCE($3, first_name),
                last_name = COALESCE($4, last_name),
                telephone = COALESCE($5, telephone),
                address = COALESCE($6, address)
        `;
        const queryParams = [username, email, first_name, last_name, telephone, address];
        let paramIndex = 7;

        if (req.user.role === 'admin' && role) {
            updateQuery += `, role = $${paramIndex}`;
            queryParams.push(role);
            paramIndex++;
        }

        let hashedPassword = null;
        if (password) {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
            updateQuery += `, password = $${paramIndex}`;
            queryParams.push(hashedPassword);
            paramIndex++;
        }

        updateQuery += ` WHERE user_id = $${paramIndex} RETURNING user_id, username, email, first_name, last_name, telephone, address, role`;
        queryParams.push(userId);

        const result = await pool.query(updateQuery, queryParams);
        const updatedUser = result.rows[0];

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found or nothing to update.' });
        }
        res.status(200).json({ msg: 'User updated successfully', user: updatedUser });

    } catch (err) {
        console.error('Error updating user:', err.message);
        // Handle unique constraint violation errors (for username/email)
        if (err.code === '23505') { // PostgreSQL unique violation error code
            return res.status(409).json({ msg: 'Username or email already exists.' });
        }
        res.status(500).json({ msg: 'Server error updating user.' });
    }
});

// --- Delete User (Admin Only) ---
// DELETE /api/users/:id
router.delete('/:id', authenticateJWT, authorizeAdmin, async (req, res) => {
    const userId = parseInt(req.params.id);

    // Prevent admin from deleting themselves (optional but good practice)
    if (req.user.user_id === userId) {
        return res.status(403).json({ msg: 'Forbidden: You cannot delete your own admin account.' });
    }

    try {
        const result = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING user_id', [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ msg: 'User not found.' });
        }
        res.status(200).json({ msg: 'User deleted successfully.' });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ msg: 'Server error deleting user.' });
    }
});

module.exports = router;