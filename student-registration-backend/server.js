// index.js (or server.js)

require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const { Pool } = require('pg');
const cors = require('cors'); // Import cors

const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment variable or default to 5000

// Middleware
app.use(express.json()); // Enable parsing of JSON request bodies
app.use(cors()); // Enable CORS for all routes

// PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database!');
    release(); // Release the client back to the pool
});

// Basic route
app.get('/', (req, res) => {
    res.send('Welcome to the Student Registration API!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});