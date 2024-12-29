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

// Route for update current admin's profile
router.put("/current/update", async (req, res) => {
    try {
      // Get the current admin's ID from active session
      const [sessions] = await db.query(`
        SELECT UserID
        FROM sessionlogs 
        WHERE LogoutTime IS NULL 
        AND UserType = 'Admin'
        ORDER BY LoginTime DESC 
        LIMIT 1
      `);
  
      if (!sessions.length) {
        return res.status(401).json({ message: "No active admin session found" });
      }
  
      const adminID = sessions[0].UserID;
      const { AdminName, UserName, Email, ContactNumber, RegistrationDate } = req.body;
  
      // Update the admin's data
      const [result] = await db.query(`
        UPDATE Admin 
        SET Name = ?,
            Username = ?,
            Email = ?,
            ContactNumber = ?,
            RegistrationDate = ?
        WHERE AdminID = ?
      `, [AdminName, UserName, Email, ContactNumber, RegistrationDate, adminID]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      res.json({ message: "Admin profile updated successfully" });
  
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Error updating admin data", error: err.message });
    }
  });
  

// Fetch received tasks
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


// Fetch employee count
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

// Fetch invoice count
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


//Route to get current admin profile
router.get("/current/profile", async (req, res) => {
    try {
      // Get the most recent active session
      const [sessions] = await db.query(`
        SELECT UserID, UserType 
        FROM sessionlogs 
        WHERE LogoutTime IS NULL 
        AND UserType = 'Admin'
        ORDER BY LoginTime DESC 
        LIMIT 1
      `);
  
      if (!sessions.length) {
        return res.status(401).json({ message: "No active admin session found" });
      }
  
      const { UserID } = sessions[0];
  
      const [admins] = await db.query(`
        SELECT 
          Name AS AdminName, 
          Username AS UserName, 
          Email,
          ContactNumber, 
          RegistrationDate
        FROM Admin
        WHERE AdminID = ?`,
        [UserID]
      );
  
      if (!admins.length) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      res.json(admins[0]);
  
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ message: "Database error" });
    }
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
// Get All Payments
router.get("/payment", async (req, res) => {
    try {
        const sql = "SELECT * FROM payment";
        const [data] = await db.query(sql); // Use await for the promise-based query
        console.log("Query successful, sending data:", data);

        // Return the data inside a 'data' key
        return res.json({
            success: true,
            message: "Payments retrieved successfully.",
            data: data,
        });
    } catch (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({ error: "Database query failed" });
    }
});
// Get Payment by ID
router.get("/payment/:id", async (req, res) => {
    const sql = "SELECT * FROM payment WHERE paymentID = ?";
    const paymentID = req.params.id;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [paymentID]);

        // Check if the payment exists
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Return the payment data
        return res.json({
            success: true,
            message: "Payment retrieved successfully.",
            data: data[0],  // Return the first matching payment
        });
    } catch (err) {
        console.error("Error fetching payment:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
        });
    }
});
//Delete payment
router.delete("/payment/:id", async (req, res) => {
    const sql = "DELETE FROM payment WHERE paymentID = ?";
    const paymentID = req.params.id;

    try {
        // Execute the query using await
        const [result] = await db.query(sql, [paymentID]);

        // Check if any rows were affected (i.e., if the payment existed)
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Payment not found",
            });
        }

        // Respond with success if the deletion was successful
        return res.status(200).json({
            success: true,
            message: "Payment deleted successfully",
            data: { paymentID },
        });
    } catch (err) {
        console.error("Error deleting payment:", err.message);
        return res.status(500).json({
            success: false,
            message: "Error deleting payment from database",
            details: err.message,
        });
    }
});
//Get Invoice
router.get("/invoice/:id", async (req, res) => {
    const sql = "SELECT * FROM invoice WHERE invoiceID = ?";
    const invoiceID = req.params.id;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [invoiceID]);

        // Check if the invoice exists
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Return the invoice data
        return res.json({
            success: true,
            message: "Invoice retrieved successfully",
            data: data[0],  // Return the first invoice object
        });
    } catch (err) {
        console.error("Error fetching invoice:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
            details: err.message,
        });
    }
});
//Get Employee
router.get("/employee/:id", async (req, res) => {
    const sql = "SELECT * FROM employee WHERE EmployeeID = ?";
    const EmployeeID = req.params.id;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [EmployeeID]);

        // Check if the employee exists
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Return the employee data
        return res.json({
            success: true,
            message: "Employee retrieved successfully",
            data: data[0],  // Return the first employee object
        });
    } catch (err) {
        console.error("Error fetching employee:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
            details: err.message,
        });
    }
});
// Get All Invoices
router.get('/invoice', async (req, res) => {
    const sql = 'SELECT * FROM invoice';

    try {
        // Execute the query and await the result
        const [data] = await db.query(sql);

        // Respond with the retrieved invoices
        return res.json({
            success: true,
            message: 'Invoices retrieved successfully',
            data: data, // Return the array of invoices
        });
    } catch (err) {
        console.error('Error executing query:', err.message);

        // Respond with error details
        return res.status(500).json({
            success: false,
            message: 'Database query failed',
            error: err.message, // Include the error message for debugging
        });
    }
});
// Delete Invoice
router.delete("/invoice/:id", async (req, res) => {
    const invoiceID = req.params.id;
    console.log("DELETE /invoice/:id called with ID:", invoiceID);

    const sql = "DELETE FROM invoice WHERE invoiceID = ?";

    try {
        // Execute the delete query and destructure the result
        const [result] = await db.query(sql, [invoiceID]);

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Invoice deleted successfully",
            data: { invoiceID },
        });
    } catch (err) {
        console.error("Error deleting invoice:", err.message);

        // Respond with error details
        return res.status(500).json({
            success: false,
            message: "Error deleting invoice from database",
            details: err.message,
        });
    }
});
// Save New Invoice
router.post("/invoice", async (req, res) => {
    const sql = `
        INSERT INTO invoice (invoiceID, EmployeeID, AccountID, total_cost, invoice_date, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        req.body.invoiceID,
        req.body.EmployeeID,
        req.body.AccountID, // Fixed typo: Ensure it matches 'AccountID' in your database schema
        req.body.total_cost,
        req.body.invoice_date, // Ensure it matches 'invoice_date' in your database schema
        req.body.description || null, // Optional field; defaults to null if not provided
    ];

    try {
        // Execute the query and retrieve the result
        const [result] = await db.query(sql, values);

        // Return success response with inserted data details
        return res.status(201).json({
            success: true,
            message: "Invoice added successfully",
            data: {
                invoiceID: req.body.invoiceID,
                EmployeeID: req.body.EmployeeID,
                AccountID: req.body.AccountID,
                total_cost: req.body.total_cost,
                invoice_date: req.body.invoice_date,
                description: req.body.description || null,
                insertId: result.insertId, // Include the auto-generated ID if applicable
            },
        });
    } catch (err) {
        console.error("Error inserting invoice data:", err.message);

        // Respond with error details
        return res.status(500).json({
            success: false,
            message: "Error inserting data into database",
            details: err.message,
        });
    }
});
// Save New Service
router.post("/service", async (req, res) => {
    console.log(req.body.invoiceID);
    const sql = "INSERT INTO service (serviceID, invoiceID, service_description, cost) VALUES (?, ?, ?, ?)";
    const values = [
        req.body.serviceID,
        req.body.invoiceID,
        req.body.service_description,
        req.body.cost
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error inserting service data:", err.message);
            return res.status(500).json({
                success: false,
                message: "Error inserting data into database",
                details: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Service added successfully",
            data: data // Sending back the response data
        });
    });
});

export default router;
