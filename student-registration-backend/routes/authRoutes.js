// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport'); // Import passport
const pool = require('../db'); // Import the database pool
const jwtConfig = require('../config/jwtConfig'); // Import JWT secret

// --- Utility function to generate JWT token ---
const generateToken = (user) => {
    // Payload contains essential user info (avoid sensitive data like raw password)
    const payload = {
        user: {
            user_id: user.user_id,
            email: user.email,
            role: user.role
        }
    };
    // Sign the token with your secret and set expiration
    return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

// --- User Registration Route (POST /api/auth/register) ---
router.post('/register', async (req, res) => {
    const { username, email, password, first_name, last_name, telephone, address, role } = req.body;

    // Basic Input Validation
    if (!username || !email || !password || !first_name || !last_name) {
        return res.status(400).json({ msg: 'Please enter all required fields: username, email, password, first_name, last_name.' });
    }
    if (role && !['student', 'admin'].includes(role)) {
        return res.status(400).json({ msg: 'Invalid role specified. Must be "student" or "admin".' });
    }

    try {
        // Check if user with given email or username already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User with that email or username already exists.' });
        }

        // Hash the password before storing it
        const saltRounds = 10; // Recommended number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, first_name, last_name, telephone, address, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING user_id, username, email, first_name, last_name, role', // RETURNING ensures we get the new user data back
            [username, email, hashedPassword, first_name, last_name, telephone, address, role || 'student'] // Default role to 'student' if not provided
        );

        const user = newUser.rows[0];

        // Generate JWT token for the newly registered user
        const token = generateToken(user);

        // Respond with success message, token, and relevant user info
        res.status(201).json({
            msg: 'User registered successfully',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Error during user registration:', err.message);
        res.status(500).json({ msg: 'Server error during registration.' });
    }
});

// --- User Login Route (POST /api/auth/login) ---
router.post('/login', (req, res, next) => {
    // Use Passport's 'local' strategy to authenticate
    // { session: false } because we are using JWTs (stateless authentication)
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Passport authentication error:', err);
            return res.status(500).json({ msg: 'Server error during login.' });
        }
        if (!user) {
            // Authentication failed (e.g., incorrect credentials)
            return res.status(400).json({ msg: info.message || 'Authentication failed.' });
        }

        // User authenticated successfully by Passport Local Strategy
        // Generate JWT token for the authenticated user
        const token = generateToken(user);

        // Respond with success message, token, and relevant user info
        return res.status(200).json({
            msg: 'Logged in successfully',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role
            }
        });
    })(req, res, next); // Ensure req, res, next are passed to the middleware
});

// --- Protected Route Example (GET /api/auth/profile) ---
// This route requires a valid JWT token in the Authorization header (Bearer token)
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    // If authentication is successful, req.user will contain the user object
    // (as retrieved by the JwtStrategy in passportConfig.js)
    res.status(200).json({
        msg: 'You have access to the protected profile!',
        user: req.user
    });
});

module.exports = router;