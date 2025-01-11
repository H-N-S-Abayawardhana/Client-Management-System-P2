import db from '../utils/db.js'; 
import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Fetch all task progress
export const getAllTaskProgress = async (req, res) => {
  const query = `SELECT * FROM TaskProgress`; // Adjust table name
  try {
    const [results] = await db.query(query); // Use promise-based query
    res.json(results);
  } catch (err) {
    console.error('Error fetching task progress:', err.message);
    res.status(500).json({ error: 'Failed to fetch task progress' });
  }
};

// Fetch task progress for a specific EmployeeID
export const getTaskProgressByEmployeeID = async (req, res) => {
  const { EmployeeID } = req.params; // Extract EmployeeID from request parameters

  if (!EmployeeID) {
    return res.status(400).json({ error: 'EmployeeID is required' });
  }

  const query = `SELECT * FROM TaskProgress WHERE EmployeeID = ?`; // Adjust table name and condition
  try {
    const [results] = await db.query(query, [EmployeeID]); // Use parameterized query to prevent SQL injection
    res.json(results);
  } catch (err) {
    console.error('Error fetching task progress:', err.message);
    res.status(500).json({ error: 'Failed to fetch task progress' });
  }
};


// Fetch tasks for a specific EmployeeID
export const getTaskByEmployeeID = async (req, res) => {
  const { EmployeeID } = req.params; // Extract EmployeeID from request parameters

  if (!EmployeeID) {
    return res.status(400).json({ error: 'EmployeeID is required' });
  }

  const query = `SELECT * FROM Task WHERE EmployeeID = ?`; // Adjust table name and condition
  try {
    const [results] = await db.query(query, [EmployeeID]); // Use parameterized query to prevent SQL injection
    res.json(results);
  } catch (err) {
    console.error('Error fetching task progress:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks of the Employee' });
  }
};


// Download task progress attachment
export const downloadAttachment = async (req, res) => {
  const { TaskProgressID } = req.params; // Task Progress ID
  const query = `SELECT Attachment FROM TaskProgress WHERE TaskProgressID = ?`;

  try {
    const [results] = await db.query(query, [TaskProgressID]);

    if (results.length === 0) {
      console.error('File not found for TaskProgressID:', TaskProgressID);
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = results[0].Attachment;

    // Validate file path
    if (!filePath || !fs.existsSync(filePath)) {
      console.error('Invalid file path:', filePath);
      return res.status(404).json({ error: 'File not found on the server' });
    }

    // Resolve the file path to prevent path traversal attacks
    const resolvedPath = path.resolve(filePath);

    // Send the file to the client
    res.download(resolvedPath, (err) => {
      if (err) {
        console.error('Error downloading file:', err.message);
        res.status(500).json({ error: 'Failed to download file' });
      }
    });
  } catch (err) {
    console.error('Database error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Configure multer to save files to a directory
export const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Function to insert task progress into the database
const addTaskProgress = async (taskData) => {
  const { TaskID, EmployeeID, TaskName, TaskDescription, Attachment } = taskData;
  const sql = `
    INSERT INTO TaskProgress (TaskID, EmployeeID, TaskName, TaskDescription, Attachment)
    VALUES (?, ?, ?, ?, ?)
  `;
  try {
    await db.query(sql, [TaskID, EmployeeID, TaskName, TaskDescription, Attachment]);
  } catch (err) {
    throw new Error('Error inserting task progress: ' + err.message);
  }
};

// Handle task progress submissions
export const handleTaskProgress = async (req, res) => {
  const { TaskID, EmployeeID, TaskName, TaskDescription } = req.body;
  const file = req.file ? path.join('uploads', req.file.filename) : null;

  const taskData = {
    TaskID,
    EmployeeID,
    TaskName,
    TaskDescription,
    Attachment: file,
  };

  try {
    await addTaskProgress(taskData);
    res.send('Task progress added successfully.');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error saving task progress.');
  }
};
