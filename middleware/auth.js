const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const protect = async (req, res, next) => {
    try {
        let token;
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = verifyToken(token);
            
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            
            req.user = await User.findById(decoded.id).select('-password');
            
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            next();
        } else {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Not authorized'
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};

module.exports = { protect, adminOnly };