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

// Route to update admin data
router.put("/admin/:id", (req, res) => {
    const adminID = req.params.id;
    const { AdminName, UserName, Email, ContactNumber, RegistrationDate } = req.body;
  
    const query = `
      UPDATE Admin 
      SET Name = ?,
          Username = ?,
          Email = ?,
          ContactNumber = ?,
          RegistrationDate = ?
      WHERE AdminID = ?`; 
  
    con.query(query, [
        AdminName,
        UserName,
        Email,
        ContactNumber,
        RegistrationDate, 
        adminID
    ], (err, result) => {
        if (err) {
            console.error("Error updating admin data:", err);
            return res.status(500).json({ message: "Error updating admin data", error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Admin not found" });
        }

        res.json({ message: "Admin profile updated successfully" });
    });
});
  

// // Fetch received tasks
router.get('/admin/received', async (req, res) => {
    try {
        const query = `
            SELECT 
                Employee_name, 
                Company, 
                Task_name, 
                Deadline, 
                Budget 
            FROM received_task`;
        
        const [data] = await con.query(query); // Use the promise-based query method

        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching received tasks.' });
    }
});


// // Fetch attendance count
router.get('/admin/attendCount', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate);

        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM attendance WHERE Date = ?";
        const [data] = await con.query(query, [currentDate]); // Use await for the promise-based query

        if (data[0].attendCount > 0) {
            return res.status(200).json(data[0].attendCount);
        } else {
            return res.json(0);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching the attendance count.' });
    }
});


// Fetch employee count// Fetch employee count
router.get('/admin/empCount', async (req, res) => {
    try {
        const query = "SELECT COUNT(EmployeeID) AS empCount FROM employee";
        const [data] = await con.query(query); // Use await with promise API
        if (data[0].empCount > 0) {
            return res.status(200).json(data[0].empCount);
        } else {
            return res.json(0);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching the employee count.' });
    }
});


router.get('/admin/invoiceCount', async (req, res) => {
    try {
        const query = "SELECT COUNT(invoiceID) AS invoiceCount FROM invoice";
        const [data] = await con.query(query); // Use promise-based query method

        if (data && data[0].invoiceCount > 0) {
            return res.status(200).json(data[0].invoiceCount);
        } else {
            return res.status(200).json(0); // Return 0 if no invoices
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch invoice count.' });
    }
});


// Route to fetch admin data by ID
router.get("/admin/:id", async (req, res) => {
    const adminID = req.params.id;
    //console.log("Route accessed with ID:", adminID);
  
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


  

export default router;
