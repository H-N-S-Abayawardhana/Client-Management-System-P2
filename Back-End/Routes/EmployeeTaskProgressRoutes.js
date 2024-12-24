import express from 'express';
import multer from 'multer';
import db from '../utils/db.js'; // Ensure `db` exports pool.promise()

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure multer for file uploads

// Get All Tasks Route - EmployeeManageTask.js UI
router.get('/tasks', async (req, res) => {
    const sql = `SELECT * FROM Task`;
    try {
        const [results] = await db.query(sql); // Use promise-based query method
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching tasks:', err.message);
        res.status(500).json({ message: 'Failed to fetch tasks.', error: err.message });
    }
});



export default router;
