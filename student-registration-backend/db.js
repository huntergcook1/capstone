// db.js
const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Optional: Test connection when this module is required
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client from pool', err.stack);
    } else {
        console.log('Database connection pool established and tested successfully.');
        release(); // Release the client back to the pool
    }
});

module.exports = pool;