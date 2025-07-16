// config/jwtConfig.js
module.exports = {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key', // Use the env var, fallback for dev
    expiresIn: '1h', // Token expiration time (e.g., 1 hour)
};