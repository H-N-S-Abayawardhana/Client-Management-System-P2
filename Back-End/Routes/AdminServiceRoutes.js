import express from 'express';
import bodyParser from 'body-parser';
import db from '../utils/db.js';
const router = express.Router();
// Middleware to parse JSON
router.use(bodyParser.json());

// Add Service Route
router.post('/add-service', async (req, res) => {
    const { ServiceName, Description, Cost } = req.body;

    if (!ServiceName || !Description || !Cost) {
        return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const sql = `INSERT INTO Service (ServiceName, Description, Cost) VALUES (?, ?, ?)`;
    try {
        const [result] = await db.query(sql, [ServiceName, Description, Cost]);
        res.status(200).json({ message: 'Service added successfully.', ServiceID: result.insertId });
    } catch (err) {
        console.error('Error adding service:', err);
        res.status(500).json({ message: 'Failed to add service.' });
    }
});

// Fetch All Services Route
router.get('/services', async (req, res) => {
    const sql = `SELECT * FROM Service`;
    try {
        const [results] = await db.query(sql);
        res.status(200).json(results);
    } catch (err) {
        console.error('Error fetching services:', err);
        res.status(500).json({ message: 'Failed to fetch services.' });
    }
});

// Delete Service Route
router.delete('/services/:id', async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Service WHERE ServiceID = ?`;
    try {
        const [result] = await db.query(sql, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Service not found.' });
        }
        res.status(200).json({ message: 'Service deleted successfully.' });
    } catch (err) {
        console.error('Error deleting service:', err);
        res.status(500).json({ message: 'Failed to delete service.' });
    }
});


export default router;
