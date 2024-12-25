import express from 'express';
import multer from 'multer';
import db from '../utils/db.js'; // Ensure `db` exports pool.promise()

import { getAllTaskProgress, upload, handleTaskProgress, downloadAttachment } from "../controllers/taskProgressControllers.js";

const router = express.Router();

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

router.post('/task-progress', upload.single('Attachment'), handleTaskProgress);

router.get('/task-progress/download/:TaskProgressID', downloadAttachment); // Download attachment

router.get('/admin-recived-tasks-progress', getAllTaskProgress); //show all the task Progress to Admin side

router.get('/employee-sended-tasks-progress', getAllTaskProgress); //show all the task Progress to client side


export default router;
