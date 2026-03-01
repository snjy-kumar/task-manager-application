import jwt from 'jsonwebtoken'
import environment from '../config/environment.js';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    if(!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    try {
        const decode = jwt.verify(token, environment.jwtSecret);
        req.User = await User.findById(decode.id);
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Token is invalid' });

    }

}
const admin = async (req, res, next) => {
    if(req.User.role !== 'admin') {
        return res.status(403).json({message: "Unauthorized"})
    }
    next();
}

// Export with multiple names for compatibility
const protect = authMiddleware;

export {authMiddleware, protect, admin}