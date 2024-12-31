import express from 'express';
import bodyParser from 'body-parser';
import db from '../utils/db.js';

const router = express.Router();

// Middleware to parse JSON
router.use(bodyParser.json());

// Add Task Route
router.post('/add-task', async (req, res) => {
    const { EmployeeID, TaskName, BudgetInfo, Description, Deadline } = req.body;

    if (!EmployeeID || !TaskName || !BudgetInfo || !Deadline) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const sql = `INSERT INTO Task (EmployeeID, TaskName, BudgetInfo, Description, Deadline) VALUES (?, ?, ?, ?, ?)`;
    try {
        const [result] = await db.query(sql, [EmployeeID, TaskName, BudgetInfo, Description, Deadline]);
        res.status(200).json({ message: 'Task added successfully.', taskID: result.insertId });
    } catch (err) {
        console.error('Error inserting task:', err);
        res.status(500).json({ message: 'Failed to add task.' });
    }
});

// Fetch All Tasks Route
router.get('/tasks', async (req, res) => {
    const sql = `SELECT * FROM Task`;
    try {
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ message: 'Failed to fetch tasks.' });
    }
});

// Delete Task Route
router.delete('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Task WHERE TaskID = ?`;
    try {
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.status(200).json({ message: 'Task deleted successfully.' });
    } catch (err) {
        console.error('Error deleting task:', err);
        res.status(500).json({ message: 'Failed to delete task.' });
    }
});

// Fetch All Tasks Progress Route
router.get('/adminRecivedTasks', async (req, res) => {
    const query = `SELECT * FROM TaskProgress`;
    try {
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('Error fetching tasks:', err);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

export default router;
