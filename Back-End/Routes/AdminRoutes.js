import express from 'express';
import bcrypt from 'bcryptjs';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../utils/db.js';
import con from '../utils/db.js'; // Assuming 'con' is your MySQL connection instance

const router = express.Router();

// Admin Change Password
router.post('/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        if (req.user.userType !== 'Admin') {
            return res.status(403).json({ message: 'Access denied.' });
        }

        const [rows] = await db.query('SELECT Password FROM Admin WHERE AdminID = ?', [req.user.id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found.' });
        }

        const admin = rows[0];
        const isPasswordValid = await bcrypt.compare(oldPassword, admin.Password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Old password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE Admin SET Password = ? WHERE AdminID = ?', [hashedPassword, req.user.id]);

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (err) {
        console.error('Error changing password:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Route to fetch admin data by ID
router.get("/:id", async (req, res) => {
    const adminID = req.params.id;
    console.log("Route accessed with ID:", adminID);
  
    try {
      const [rows] = await db.query(`
        SELECT 
          Name AS AdminName, 
          Username AS UserName, 
          Email, 
          ContactNumber, 
          RegistrationDate 
        FROM Admin 
        WHERE AdminID = ?`, 
        [adminID]
      );
  
      if (!rows.length) {
        return res.status(404).json({ error: "Admin not found" });
      }
  
      res.json(rows[0]);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Database error" });
    }
  });
  // Route to update admin data
router.put("/:id", (req, res) => {
    const adminID = req.params.id;
    const { AdminName, UserName, Email, ContactNumber } = req.body;
  
    const query = `
      UPDATE Admin 
      SET Name = ?, Username = ?, Email = ?, ContactNumber = ?
      WHERE AdminID = ?`;
  
    con.query(query, [AdminName, UserName, Email, ContactNumber, adminID], (err, result) => {
      if (err) {
        console.error("Error updating admin data:", err);
        res.status(500).send("Error updating admin data");
      } else {
        res.send("Admin profile updated successfully");
      }
    });
  });
  

// Fetch received tasks
router.get('/received', (req, res) => {
    try {
        const query = "SELECT received_task.Employee_name, received_task.Company, received_task.Task_name, received_task.Deadline, received_task.Budget FROM received_task";
        con.query(query, (error, data) => {
            if (error) {
                return res.json(error);
            } else {
                return res.status(200).json(data);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Fetch attendance count
router.get('/attendCount', (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate);
        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM attendance WHERE Date = ?";
        con.query(query, [currentDate], (error, data) => {
            if (error) {
                return res.json(error);
            } else {
                if (data[0].attendCount > 0) {
                    return res.status(200).json(data[0].attendCount);
                } else {
                    return res.json(0);
                }
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Fetch employee count
router.get('/empCount', (req, res) => {
    try {
        const query = "SELECT COUNT(EmployeeID) AS empCount FROM employee";
        con.query(query, (error, data) => {
            if (data[0].empCount > 0) {
                return res.status(200).json(data[0].empCount);
            } else {
                return res.json(0);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

// Fetch invoice count
router.get('/invoiceCount', (req, res) => {
    try {
        const query = "SELECT COUNT(invoiceID) AS invoiceCount FROM invoice";
        con.query(query, (error, data) => {
            if (data[0].invoiceCount > 0) {
                return res.status(200).json(data[0].invoiceCount);
            } else {
                return res.json(0);
            }
        });
    } catch (error) {
        console.log(error);
    }
});

export default router;
