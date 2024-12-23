// Middleware/Auth.js
// Contains middleware functions for authentication.
const jwt = require('jsonwebtoken');

const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).send({ message: 'Unauthorized' });
    }

    const token = auth.split(' ')[1]; // Extract token from "Bearer <token>"
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Invalid token' });
    }
};

module.exports = { ensureAuthenticated };