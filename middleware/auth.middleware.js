const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    // Check if not token
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const token = authHeader.split(' ')[1]; // Expecting "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}; 