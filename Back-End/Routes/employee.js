import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../utils/db.js';

const router = express.Router();

// Get tasks for the logged-in employee
/*
router.get('/tasks', authenticateToken, async (req, res) => {
    if (req.user.userType !== 'Employee') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const [tasks] = await db.query('SELECT * FROM Task WHERE EmployeeID = ?', [req.user.id]);
        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});*/

export default router; // Use default export for ES Modules

