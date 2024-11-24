require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate user
const authenticate = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(403).json({ message: 'Access denied. No token provided or invalid format.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('-password'); 

        if (!user) {
            return res.status(401).json({ message: 'User not found. Invalid token.' });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: error });
        }
        res.status(401).json({ message: error });
    }
};

// Middleware to authorize specific roles
const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
};

module.exports = { authenticate, authorize };
