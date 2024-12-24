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

        // Generate JWT
        const token = jwt.sign(
            { id: user.AdminID || user.EmployeeID, userType },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Log the login in SessionLogs
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


// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import db from '../utils/db.js';

// const router = express.Router();

// router.post('/login', async (req, res) => {
//     const { email, password, userType } = req.body;

//     try {
//         if (!email || !password || !userType) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Determine which table to query
//         const tableName = userType === 'Admin' ? 'Admin' : 'Employee';
//         console.log(`Querying table: ${tableName}`); // Debugging log

//         // Fetch user from the appropriate table
//         const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE Email = ?`, [email]);

//         if (rows.length === 0) {
//             console.log(`No user found for email: ${email}`); // Debugging log
//             return res.status(404).json({ message: 'User not found.' });
//         }

//         const user = rows[0];
//         console.log('User fetched from DB:', user); // Debugging log

//         // Compare the provided password with the hashed password in DB
//         const isPasswordValid = await bcrypt.compare(password, user.Password);
//         if (!isPasswordValid) {
//             console.log('Password mismatch'); // Debugging log
//             return res.status(401).json({ message: 'Invalid credentials.' });
//         }

//         // Generate JWT
//         const token = jwt.sign(
//             { id: user.AdminID || user.EmployeeID, userType },
//             process.env.JWT_SECRET,
//             { expiresIn: '1h' }
//         );

//         console.log('Login successful'); // Debugging log
//         res.status(200).json({
//             message: 'Login successful.',
//             token,
//             user: {
//                 id: user.AdminID || user.EmployeeID,
//                 name: user.Name,
//                 userType,
//             },
//         });
//     } catch (err) {
//         console.error('Error during login:', err); // Debugging log
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// router.post('/reset-password', async (req, res) => {
//     const { email, mobile, newPassword } = req.body;

//     try {
//         if (!email || !mobile || !newPassword) {
//             return res.status(400).json({ message: 'All fields are required.' });
//         }

//         // Determine user type and validate
//         let userType = null;
//         let [user] = await db.query('SELECT * FROM Admin WHERE Email = ? AND ContactNumber = ?', [email, mobile]);
//         if (user.length === 0) {
//             [user] = await db.query('SELECT * FROM Employee WHERE Email = ? AND ContactNumber = ?', [email, mobile]);
//             if (user.length === 0) {
//                 return res.status(404).json({ message: 'User not found.' });
//             }
//             userType = 'Employee';
//         } else {
//             userType = 'Admin';
//         }

//         // Hash the new password
//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         // Update password in the database
//         const tableName = userType === 'Admin' ? 'Admin' : 'Employee';
//         await db.query(`UPDATE ${tableName} SET Password = ? WHERE Email = ? AND ContactNumber = ?`, [hashedPassword, email, mobile]);

//         res.status(200).json({ message: 'Password reset successfully.' });
//     } catch (err) {
//         console.error('Error resetting password:', err);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// });

// export default router;

