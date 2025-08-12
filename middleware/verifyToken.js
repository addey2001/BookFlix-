import jwt from 'jsonwebtoken';
import { Unauthorized } from '../utils/errors.js';


const verifyToken = (req, res, next) => {
    try {
        // verify an auth header had been provided 
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Unauthorized('Access token required');
        }
        
        // Check if header starts with 'Bearer '
        if (!authHeader.startsWith('Bearer ')) {
            throw new Unauthorized('Invalid token format');
        }
        
        // Extract token (remove 'Bearer ' prefix)
        const token = authHeader.substring(7);
      
        // Verify token
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        console.log(decoded)
        // Add user info to request object
        req.user = decoded.user;
        
        // Continue to next middleware/route
        next();
        
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            next(new Unauthorized('Invalid token'));
        } else if (error.name === 'TokenExpiredError') {
            next(new Unauthorized('Token expired'));
        } else {
            next(error);
        }
    }
}

export default verifyToken;