
const passport = require('passport');
const jwt = require('jsonwebtoken'); 
const jwtConfig = require('../config/jwtConfig');

// Middleware to ensure user is authenticated via JWT
const authenticateJWT = passport.authenticate('jwt', { session: false });

// Middleware to check if user has 'admin' role
const authorizeAdmin = (req, res, next) => {
    // req.user is populated by passport.authenticate('jwt')
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the next middleware/route handler
    } else {
        res.status(403).json({ msg: 'Forbidden: You do not have administrator privileges.' });
    }
};

// Middleware to check if user is a 'student'
const authorizeStudent = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next(); // User is a student, proceed
    } else {
        res.status(403).json({ msg: 'Forbidden: You do not have student privileges.' });
    }
};

module.exports = {
    authenticateJWT,
    authorizeAdmin,
    authorizeStudent
};