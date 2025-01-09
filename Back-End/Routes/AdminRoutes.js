import express from 'express';
import bcrypt from 'bcryptjs';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import authenticateToken from '../middleware/authMiddleware.js';
import { formatDateToDMY } from "../utils/formatDate.js";
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

// NEW DATA FETCHING METHOD OF CURRENT LOGGED ADMIN USING LOCALHOST
router.get("/admin/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Email received:", email); // Log 1
        
        const [admins] = await db.query(
            `SELECT 
                Name,
                Email,
                ContactNumber,
                Username,
                RegistrationDate,
                AdminID
             FROM admin
             WHERE Email = ?`,
            [email]
        );

        console.log("Database result:", admins); // Log 2
        console.log("First admin:", admins[0]); // Log 3

        if (!admins.length) {
            return res.status(404).json({ message: "Admin not found" });
        }

        console.log("Data being sent:", admins[0]); // Log 4
        res.json(admins[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});

router.get('/admin/username/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const [result] = await db.execute(
            'SELECT Username FROM admin WHERE email = ?',
            [email]
        );

        if (result.length > 0) {
            res.status(200).json({ username: result[0].Username });
        } else {
            res.status(404).json({ message: 'Admin not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



router.put("/current/update", async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
  
      const {
        Name,
        Username,
        Email,
        ContactNumber,
        RegistrationDate,
        AdminID
      } = req.body;
  
      const [result] = await db.query(
        `UPDATE admin 
         SET Name = ?, 
             Username = ?, 
             Email = ?, 
             ContactNumber = ?,
             RegistrationDate = ?
         WHERE AdminID = ?`,
        [Name, Username, Email, ContactNumber, RegistrationDate, AdminID]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Admin not found" });
      }
  
      res.json({ message: "Admin updated successfully" });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Error updating admin" });
    }
  });
  
  


// // Fetch attendance count
router.get('/admin/attendCount', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        // Modified query to compare only date portions
        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM attendance WHERE DATE(Date) = ?";
        const [data] = await con.query(query, [currentDate]);

        return res.status(200).json(data[0].attendCount || 0);
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
        const query = "SELECT COUNT(invoiceID) AS invoiceCount FROM invoice Where status = 'unpaid'";
        const [data] = await con.query(query); 

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
        INSERT INTO invoice (invoiceID, EmployeeID, AcountId, total_cost, invoice_date, description,status)
        VALUES (?, ?, ?, ?, ?, ?,?)
    `;
    const values = [
        req.body.invoiceID,
        req.body.EmployeeID,
        req.body.AcountId, // Fixed typo: Ensure it matches 'AccountID' in your database schema
        req.body.total_cost,
        req.body.invoice_date, // Ensure it matches 'invoice_date' in your database schema
        req.body.description || null, // Optional field; defaults to null if not provided
        req.body.status,
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
                AccountID: req.body.AcountId,
                total_cost: req.body.total_cost,
                invoice_date: req.body.invoice_date,
                description: req.body.description || null,
                status: req.body.status,
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
router.post('/service', async (req, res) => {
    const { invoiceID, service_description, cost } = req.body;
    // Validate input fields
    if ( !invoiceID || !service_description || cost === undefined) {
        return res.status(400).json({
            message: 'All required fields must be filled.',
            missingFields: [
                !invoiceID && 'invoiceID',
                !service_description && 'service_description',
                cost === undefined && 'cost'
            ].filter(Boolean) // Filters out falsy values
        });
    }

    // Insert service into the database
    const sql = 'INSERT INTO Service ( invoiceID, service_description, cost) VALUES ( ?, ?, ?)';
    const values = [invoiceID, service_description, cost];
    try {
        const [result] = await db.query(sql, values);
        res.status(200).json({
            message: 'Service added successfully.',
            data: result
        });
    } catch (err) {
        console.error('Error adding service:', err);
        res.status(500).json({
            message: 'Failed to add service.',
            error: err.message
        });
    }
});

// Route to view all attendances ...
router.get('/ViewAllAttendances', async (req, res) => {
    try {
        // const sql = `SELECT * FROM attendance INNER JOIN employee ON attendance.EmployeeID = employee.EmployeeID`;
        const sql = `SELECT 
                        LPAD(ROW_NUMBER() OVER (ORDER BY employee.EmployeeID), 2, '0') AS RowNumber,
                        employee.EmployeeID,
                        employee.name, 
                        employee.email, 
                        DATE(attendance.date) AS date,
                        CASE
                            WHEN TIME(attendance.date) >= '08:00:00' AND TIME(attendance.date) < '09:00:00' THEN 'Attended'
                            WHEN HOUR(attendance.date) >= '09:00:00' AND TIME(attendance.date) < '17:00:00' THEN 'Late Attended'
                            ELSE 'Not Attended'
                        END AS status
                    FROM 
                        attendance 
                    INNER JOIN 
                        employee 
                    ON 
                        attendance.EmployeeID = employee.EmployeeID`;

        const [data] = await db.query(sql);
        if(data.length === 0) {
            return res.status(404).send("No attendances found");
        }

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occurred while fetching attendances");
    }
});

// Route to search the attendance ...
router.get('/attendance/:date', async (req, res) => {
    try {
        const date = req.params.date;
        const sql = `SELECT * FROM attendance INNER JOIN employee ON attendance.EmployeeID = employee.EmployeeID 
                WHERE DATE(attendance.date) = ?`;
        const [data] = await db.query(sql, [date]);

        if (data.length === 0) {
            return res.status(404).send("Employee not found");
        }

        return res.status(200).json(data);  // Return a single employee object
    } catch (error) {
        console.error("Error fetching employee:", error.message);
        return res.status(500).send(error.message);
    }
});

// Route to reset data in the table and database ...
router.get('/resetData', async (req, res) => {
    try {
        const result = await db.query(`DELETE FROM attendance`);
        return res.status(200).json({ message: 'Data reset successfully', data: result });
    } catch(error) {
        console.log(error);
        return res.status(500).send('An error occurred while resetting data');
    }
});

// Route to generate a pdf file ... Not Completed ...
router.get('/generatePDF', async (req, res) => {
    // console.log(req);
    try {
        const sql = `SELECT 
                    LPAD(ROW_NUMBER() OVER (ORDER BY employee.EmployeeID), 2, '0') AS RowNumber,
                    employee.name, 
                    employee.email, 
                    DATE(attendance.date) AS date,
                    CASE
                        WHEN TIME(attendance.date) >= '08:00:00' AND TIME(attendance.date) < '09:00:00' THEN 'Attended'
                        WHEN HOUR(attendance.date) >= '09:00:00' AND TIME(attendance.date) < '17:00:00' THEN 'Late Attended'
                        ELSE 'Not Attended'
                    END AS status
                FROM 
                    attendance 
                INNER JOIN 
                    employee 
                ON 
                    attendance.EmployeeID = employee.EmployeeID`;
        // Await the query result
        const [result] = await db.query(sql);
        const doc = new PDFDocument();
        const fileName = `Attendance report-${Date.now()}.pdf`;
        const filePath = `./${fileName}`;

        // Pipe the PDF to a file ...
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Add Title ...
        doc.font('Helvetica-Bold').fontSize(20).text(`Employee Attendance Report - ${formatDateToDMY(new Date(Date.now()))}`, { align: 'center' });
        doc.moveDown();

        if (result.length === 0) {
            doc.font('Helvetica-Bold').fontSize(18).fillColor('#000000').text('No attendance records found.', { align: 'center' });
        } else {
            // Define the table structure ...
            const tableHeaders = ['No.', 'Name', 'Date', 'Email', 'Status'];
            const columnWidths = [50, 180, 70, 180, 70]; // Custom column widths
            const tableRows = result.map(item => [
                item.RowNumber,
                item.name,
                formatDateToDMY(new Date(item.date)),
                item.email,
                item.status
            ]);

            // Calculate initial X position for each column ...
            const startX = 50; // Starting point on X-axis ...
            let currentX;

            // Draw table headers with styling ...
            let y = 100;
            currentX = startX;
            tableHeaders.forEach((header, i) => {
                // Draw the header border ...
                doc.rect(currentX, y, columnWidths[i], 20).stroke();
                doc.font('Helvetica-Bold').fontSize(12).fillColor('#000000').text(header, currentX + 5, y + 5, { width: columnWidths[i], align: 'center' });
                currentX += columnWidths[i]; // Move to the next column ...
            });
            y += 20;

            // Draw table rows with borders ...
            tableRows.forEach(row => {
                currentX = startX; // Reset to start of row ...
                row.forEach((cell, i) => {
                    // Draw the cell border
                    doc.rect(currentX, y, columnWidths[i], 20).stroke();

                    // Apply different styles for each column if needed ...
                    const cellTextColor = i === 4 && cell === 'Attended' ? '#27AE60' : i === 4 && cell === 'Late Attended' ? '#E74C3C' : '#000000';
                    doc.fontSize(8).fillColor(cellTextColor).text(cell.toString(), currentX + 5, y + 5, { width: columnWidths[i], align: 'center' });
                        currentX += columnWidths[i]; // Move to the next column ...
                    });
                    y += 20; // Move to the next row ...
                });
            }

            // Finalize the document and send response ...
            doc.end();
            stream.on('finish', () => {
                res.download(filePath, fileName, (error) => {
                    if (error) console.error(error);
                    fs.unlinkSync(filePath); // Clean up the file after download ...
                });
            });

    } catch (error) {
        console.log(error);
        return res.status(500).send('An error occurred while generating PDF');
    }
});

// Route to get all the employees ...
router.get("/employees", async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM employee");

        if (data.length === 0) {
            return res.status(404).send("Employee not found");
        }
        
        console.log("Query successful, sending data:", data);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).send(err.message);
    }
});

// Route to get an employee by ID ...
router.get("/employee/:EmployeeID", async (req, res) => {
    try {
        const sql = "SELECT * FROM employee WHERE EmployeeID = ?";
        const { EmployeeID } = req.params;  // Destructure to get EmployeeID from the request params
        const [data] = await db.query(sql, [EmployeeID]);

        if (data.length === 0) {
            return res.status(404).send("Employee not found");
        }

        return res.status(200).json(data);  // Return a single employee object
    } catch (err) {
        console.error("Error fetching employee:", err.message);
        return res.status(500).send(err.message);
    }
});

// Route to register a new employee ...
router.post("/register", async (req, res) => {
    try {
        console.log(req.body);
        // Hasing the entered password ...
        const hashedPassword = await bcrypt.hash(req.body.Password, 10);
        console.log(hashedPassword);
        const sql = "INSERT INTO employee (Name, Address, ContactNumber, Designation, WorkStartDate, Email, Username, Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [ req.body.Name, req.body.Address, req.body.ContactNumber, req.body.Designation,
                    req.body.WorkStartDate, req.body.Email, req.body.UserName, hashedPassword ];
        console.log(values);
        const result = await db.query(sql, values);
        console.log("Query successful, inserting data:", result);
        return res.status(201).json({ message: "Employee added successfully", data: result });
    } catch (error) {
        console.error("Error inserting data:", error.message);
        return res.status(500).send("Error inserting data into database", error.message);
    }
});

// Route to update an existing employee ...
router.put('/update/:EmployeeID', async (req, res) => {
    console.log(req.body);
    const sql = "UPDATE employee SET Name = ?, Address = ?, ContactNumber = ?, Designation = ?, WorkStartDate = ?, Email = ?, Username = ? WHERE EmployeeID = ?";
    const values = [
        req.body.Name,
        req.body.Address,
        req.body.ContactNumber,
        req.body.Designation,
        req.body.WorkStartDate,
        req.body.Email,
        req.body.Username,
        req.params.EmployeeID
    ];

    try {
        const result = await db.query(sql, values);
        console.log("Query successful, updated data:", result);
        return res.status(200).json({ message: "Employee updated successfully", data: result });
    } catch (error) {
        console.error("Error updating data:", error.message);
        return res.status(500).send("Error updating data", error.message);
    }
});

// Route to delete an employee ...
router.delete("/employee/:EmployeeID", async (req, res) => {
    const sql = "DELETE FROM employee WHERE EmployeeID = ?";
    const EmployeeID = req.params.EmployeeID;

    try {
        const result = await db.query(sql, [EmployeeID]);
        console.log("Query successful, deleted data:", result);
        return res.status(200).send("Employee deleted successfully");
    } catch(error) {
        console.error("Error deleting data:", error.message);
        return res.status(500).send("Error deleting data", error.message);
    }
});


export default router;
