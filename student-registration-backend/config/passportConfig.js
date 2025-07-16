// config/passportConfig.js
const { Strategy: LocalStrategy } = require('passport-local');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Import the database pool
const jwtConfig = require('./jwtConfig');

module.exports = function (passport) {
    // Local Strategy (for username/password login)
    // Passport will look for 'email' and 'password' in the request body
    passport.use(new LocalStrategy({
        usernameField: 'email', // Use email as the username field
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            // Find user by email in the database
            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];

            if (!user) {
                // User not found
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // Compare provided password with hashed password in DB
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                // Passwords do not match
                return done(null, false, { message: 'Incorrect email or password.' });
            }

            // User authenticated successfully
            return done(null, user);
        } catch (err) {
            // Handle any database or bcrypt errors
            return done(err);
        }
    }));

    // JWT Strategy (for token-based authentication on protected routes)
    // Extracts the JWT from the Authorization header (Bearer token)
    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.secret // Use your JWT secret to verify the token
    }, async (jwt_payload, done) => {
        try {
            // Find user by ID from the JWT payload
            // Only select necessary fields (avoid password)
            const result = await pool.query('SELECT user_id, username, email, first_name, last_name, role FROM users WHERE user_id = $1', [jwt_payload.user.user_id]);
            const user = result.rows[0];

            if (user) {
                // User found, attach user object to req.user
                return done(null, user);
            } else {
                // User not found (token might be valid but user deleted)
                return done(null, false);
            }
        } catch (err) {
            // Handle any database errors
            return done(err);
        }
    }));

    // Passport serialization/deserialization (less critical for stateless JWT but good practice)
    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const result = await pool.query('SELECT user_id, username, email, first_name, last_name, role FROM users WHERE user_id = $1', [id]);
            const user = result.rows[0];
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};