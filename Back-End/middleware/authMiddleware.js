import jwt from 'jsonwebtoken';
import db from '../utils/db.js';

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check if the token exists in the SessionLogs table
        const [rows] = await db.query(`SELECT * FROM SessionLogs WHERE Token = ? AND LogoutTime IS NULL`, [token]);

        if (rows.length === 0) {
            return res.status(403).json({ message: 'Invalid or expired session.' });
        }

        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
};

export default authenticateToken;
