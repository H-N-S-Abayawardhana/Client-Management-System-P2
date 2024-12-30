import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../utils/db.js';

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password, userType } = req.body;

    try {
        if (!email || !password || !userType) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const tableName = userType === 'Admin' ? 'Admin' : 'Employee';

        const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE Email = ?`, [email]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Set expiration time manually
        const expTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour
        const token = jwt.sign(
            { id: user.AdminID || user.EmployeeID, userType, exp: expTime },
            process.env.JWT_SECRET
        );

        console.log('Generated Token Exp:', new Date(expTime * 1000));

        await db.query(
            `INSERT INTO SessionLogs (UserID, UserType, Token) VALUES (?, ?, ?)`,
            [user.AdminID || user.EmployeeID, userType, token]
        );

        res.status(200).json({
            message: 'Login successful.',
            token,
            user: {
                id: user.AdminID || user.EmployeeID,
                name: user.Name,
                userType,
            },
        });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Logout Route
router.post('/logout', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required.' });
    }

    try {
        // Invalidate the token by setting the LogoutTime
        const result = await db.query(
            `UPDATE SessionLogs SET LogoutTime = CURRENT_TIMESTAMP WHERE Token = ?`,
            [token]
        );

        if (result[0].affectedRows === 0) {
            return res.status(404).json({ message: 'Session not found.' });
        }

        res.status(200).json({ message: 'Logout successful.' });
    } catch (err) {
        console.error('Error during logout:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;
