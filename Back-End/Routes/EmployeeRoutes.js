import express from "express";
import db from "../utils/db.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { isDDMMYYYYWithDash, isYYYYMMDD } from "../utils/formatDate.js";

const router = express.Router();

router.get("/employee/profile/:email", async (req, res) => {
    try {
        const { email } = req.params;
        
        // Fetch employee data using email
        const [employees] = await db.query(
            `SELECT 
                Name,
                Designation,
                Email,
                ContactNumber,
                Address,
                WorkStartDate,
                EmployeeID
             FROM employee
             WHERE Email = ?`,
            [email]
        );

        if (!employees.length) {
            return res.status(404).json({ message: "Employee not found" });
        }

        res.json(employees[0]);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error" });
    }
});


//Fetch Employee Count
router.get('/employee/empCount', async (req, res) => {
    const query = "SELECT COUNT(EmployeeID) AS empCount FROM employee";

    try {
        const [rows] = await db.query(query);
        const count = rows[0]?.empCount || 0;
        return res.status(200).json({ empCount: count });
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database error" });
    }
});

router.get('/employee/attendCount', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        // Modified query to compare only date portions
        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM attendance WHERE DATE(Date) = ?";
        const [data] = await db.query(query, [currentDate]);

        return res.status(200).json(data[0].attendCount || 0);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching the attendance count.' });
    }
});

//Fetch Tasks
router.get('/employee/task', async (req, res) => {
    const query = `
        SELECT
            employee.Name AS EmployeeName,
            task.TaskName,
            task.Deadline,
            task.Budget,
            task.Description
        FROM task
                 INNER JOIN employee ON task.EmployeeID = employee.EmployeeID
    `;

    try {
        // Use promise-based query
        const [rows] = await db.query(query);
        return res.status(200).json(rows);
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
    }
});


// Fetch invoice count
router.get('/employee/invoiceCount', async (req, res) => {
    const query = "SELECT COUNT(invoiceID) AS invoiceCount FROM invoice";

    try {
        // Use promise-based query
        const [rows] = await db.query(query);
        const invoiceCount = rows[0]?.invoiceCount || 0;
        return res.status(200).json({ invoiceCount });
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ error: "Database error" });
    }
});




// Save payment
router.post("/payment", async (req, res) => {
    const sql = `INSERT INTO payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const {invoiceID,EmployeeID,card_holder_name,card_number,expiry_date,cvc,amount,payment_status,payment_date} = req.body;
    const values = [invoiceID,EmployeeID,card_holder_name,card_number,expiry_date,cvc,amount,payment_status,payment_date];
    try {
        const [result] = await db.query(sql, values);
        res.status(200).json({
            message: 'Payment added successfully.',
            data: result
        });
    } catch (err) {
        console.error('Error adding Payment:', err);
        res.status(500).json({
            message: 'Failed to add Payment.',
            error: err.message
        });
    }

});


//Get all invoice which unpaid
router.get('/employee/invoice', async (req, res) => {
    const sql = 'SELECT * FROM invoice WHERE status="unpaid"';

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
//Get all payment by empid
router.get('/employee/payment/:id', async (req, res) => {
    const sql = 'SELECT * FROM payment WHERE EmployeeID =?';
    const EmployeeID = req.params.id;
    try {
        // Execute the query and await the result
        const [data] = await db.query(sql,[EmployeeID]);

        // Respond with the retrieved invoices
        return res.json({
            success: true,
            message: 'Payments retrieved successfully',
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
//Get all payment by empid
router.get('/employee/invoice/:id', async (req, res) => {
    const sql = 'SELECT * FROM invoice WHERE EmployeeID =?';
    const EmployeeID = req.params.id;
    try {
        // Execute the query and await the result
        const [data] = await db.query(sql,[EmployeeID]);

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

// Get Invoice by ID
router.get("/invoice/:id", async (req, res) => {
    const sql = "SELECT * FROM invoice WHERE InvoiceID = ?";
    const InvoiceID = req.params.id;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [InvoiceID]);

        // Check if the payment exists
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Return the payment data
        return res.json({
            success: true,
            message: "Invoice retrieved successfully.",
            data: data[0],  // Return the first matching payment
        });
    } catch (err) {
        console.error("Error fetching invoice:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
        });
    }
});
//Get Employee
router.get("/emp/:id", async (req, res) => {
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
});// Get service
router.get("/service/:id", async (req, res) => {
    const sql = "SELECT * FROM Service WHERE invoiceID = ?";
    const invoiceID = req.params.id;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [invoiceID]);

        // Debugging: Log the retrieved data
        console.log("Service data:", data);

        // Check if the services exist
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Services not found",
            });
        }

        // Return the array of services (not just the first service)
        return res.json({
            success: true,
            message: "Services retrieved successfully",
            data: data,  // Return all services
        });
    } catch (err) {
        console.error("Error fetching services:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
            details: err.message,
        });
    }
});

// Get Email by Email
router.get("/employee/:email", async (req, res) => {
    const sql = "SELECT * FROM employee WHERE email = ?";
    const paymentID = req.params.email;

    try {
        // Use the promise-based query method
        const [data] = await db.query(sql, [paymentID]);

        // Check if the payment exists
        if (data.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        // Return the payment data
        return res.json({
            success: true,
            message: "Employee retrieved successfully.",
            data: data[0],  // Return the first matching payment
        });
    } catch (err) {
        console.error("Error fetching Employee:", err.message);
        return res.status(500).json({
            success: false,
            message: "Database query failed",
        });
    }
});





// Route to view all employees ...
router.get('/ViewAllEmployees', (req, res) => {
    try {
        const sql = `SELECT * FROM employee`;
        con.query(sql, (err, data) => {
            if(err) return res.json(err);
            return res.json(data);
        });
    } catch(error) {
        console.log(error);
    }
});

// Route to view all attendances ...
router.get('/ViewAllAttendances', async (req, res) => {
    try {
        const sql = `SELECT
                         ROW_NUMBER() OVER (ORDER BY employee.EmployeeID) AS RowNumber,
                             employee.EmployeeID,
                         employee.name,
                         employee.email,
                         DATE(attendance.date) AS date,
                         TIME(attendance.date) AS time, -- Updated to show proper time field
                         CASE
                         WHEN HOUR(attendance.date) BETWEEN 8 AND 9 AND MINUTE(attendance.date) BETWEEN 0 AND 59 THEN 'Attended'
                         WHEN HOUR(attendance.date) BETWEEN 9 AND 17 THEN 'Late Attended'
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
            return res.status(404).json({ message: "No attendances found" });
        }

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "An error occurred while fetching the attendances" });
    }
});

// Route to get employee information trough input ...
router.get('/viewEmployees/:input', async (req, res) => {
    try {
        const input = req.params.input;
        const sql = `SELECT * FROM employee WHERE name = ? OR email = ?`;
        const [data] = await db.query(sql, [input, input]);

        if(data.length === 0) {
            return res.status(404).json({ message: "No employee found" });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "An error occurred while fetching the employee" });
    }
});

// Route to search the attendance ...
router.get('/attendance/:input', async (req, res) => {
    try {
        const input = req.params.input;
        const sql = `SELECT
                         ROW_NUMBER() OVER (ORDER BY employee.EmployeeID) AS RowNumber,
                             employee.EmployeeID,
                         employee.name,
                         employee.email,
                         DATE(attendance.date) AS date,
                         TIME(attendance.date) AS time, -- Added proper time display
                         CASE
                         WHEN HOUR(attendance.date) BETWEEN 8 AND 9 AND MINUTE(attendance.date) BETWEEN 0 AND 59 THEN 'Attended'
                         ELSE 'Not Attended'
        END AS status
                  FROM 
                      attendance 
                  INNER JOIN 
                      employee 
                  ON 
                      attendance.EmployeeID = employee.EmployeeID 
                  WHERE 
                      (employee.name LIKE CONCAT(?, '%')  -- Matches names starting with the entered text
                      OR employee.email LIKE CONCAT(?, '%')  -- Matches emails starting with the entered text
                      OR DATE(attendance.date) LIKE CONCAT(?, '%'))  -- Matches dates starting with the entered text`;

        if (isDDMMYYYYWithDash(input)) {
            const [day, month, year] = input.split('-');
            const formattedDate = `${year}-${month}-${day}`;
            const [data] = await db.query(sql, [formattedDate, formattedDate, formattedDate]);
            if(data.length === 0) {
                return res.status(404).json({ message: "No attendance found" });
            }

            return res.status(200).json(data);
        } else if (isYYYYMMDD(input)) {
            const [data] = await db.query(sql, [input, input, input]);
            if(data.length === 0) {
                return res.status(404).json({ message: "No attendance found" });
            }
            return res.status(200).json(data);
        } else {
            const [data] = await db.query(sql, [input, input, input]);
            if(data.length === 0) {
                return res.status(404).json({ message: "No attendance found" });
            }
            return res.status(200).json(data);
        }
    } catch(error) {
        console.log(error);
    }
});


// Add Attendance Route (with async/await)
router.post('/addAttendance', async (req, res) => {
    try {
        const { name, date, email, employeeId } = req.body;

        const current_date = new Date();
        const hour = current_date.getHours();
        const minute = current_date.getMinutes();
        const second = current_date.getSeconds();

        // Concatenate the `date` with the current time in HH:mm:ss format ...
        const fullDateTime = `${date} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        console.log(name, date, email, hour, minute, second, fullDateTime);

        if(hour >= 8 && hour < 17) {
            // Insert the new attendance record into the database ...
            const sql2 = `INSERT INTO attendance (EmployeeID, Name, Email, Date) VALUES (?, ?, ?, ?)`;
            await db.query(sql2, [employeeId, name, email, fullDateTime]);
            return res.status(200).json({ message: "Attendance added successfully!"});
        } else {
            return res.status(202).json({ message: "You can't mark attendance at this time. It can be done from 8am to 5pm !"});
        }
    } catch(error) {
        console.log(error.message);
        return res.status(500).json({ message: "An error occurred while adding attendance record!"});
    }
});

export default router;
