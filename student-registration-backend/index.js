require('dotenv').config(); // Load environment variables first

const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Import the database pool (from the new db.js)
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const passport = require('passport'); // Import passport
require('./config/passportConfig')(passport); // Configure passport strategies
const userRoutes = require('./routes/userRoutes');
const app = express();
const PORT = process.env.PORT || 5000;
const courseRoutes = require('./routes/courseRoutes'); // Import course routes
// Middlewarez
app.use(express.json()); // Enable parsing of JSON request bodies
app.use(cors()); // Enable CORS for all routes

// Initialize Passport middleware
app.use(passport.initialize());

// Basic route for testing server
app.get('/', (req, res) => {
    res.send('Welcome to the Student Registration API!');
});

// Mount Authentication Routes
// All routes in authRoutes.js will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes); // Mount user routes

// Mount Course Routes
app.use('/api/courses', courseRoutes); // Mount course routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});