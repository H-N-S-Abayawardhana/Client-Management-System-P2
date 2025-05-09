import express from "express";
import db from "../utils/db.js";
import { isDDMMYYYYWithDash, isYYYYMMDD } from "../utils/formatDate.js";

const router = express.Router();


// NEW DATA FETCHING METHOD OF CURRENT LOGGED EMPLOYEE USING LOCALHOST
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
             FROM Employee
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

//get employee name
router.get('/employee/name/:email', async (req, res) => {
    try {
        const { email } = req.params;

        const [result] = await db.execute(
            'SELECT Name FROM Employee WHERE email = ?',
            [email]
        );

        if (result.length > 0) {
            res.status(200).json({ name: result[0].Name });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});



//Fetch Employee Count
router.get('/employee/empCount', async (req, res) => {
    const query = "SELECT COUNT(EmployeeID) AS empCount FROM Employee";

    try {
        const [rows] = await db.query(query);
        const count = rows[0]?.empCount || 0;
        return res.status(200).json({ empCount: count });
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database error" });
    }
});



// Fetch Payment Count
router.get('/employee/paymentCount', async (req, res) => {
    const query = "SELECT COUNT(paymentID) AS paymentCount FROM Payment";

    try {
        const [rows] = await db.query(query);
        const count = rows[0]?.paymentCount || 0;
        return res.status(200).json({ paymentCount: count });
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: "Database error" });
    }
});


//Fetch attend count
router.get('/employee/attendCount', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];

        // Modified query to compare only date portions
        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM Attendance WHERE DATE(Date) = ?";
        const [data] = await db.query(query, [currentDate]);

        return res.status(200).json(data[0].attendCount || 0);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while fetching the attendance count.' });
    }
});

// Fetch invoice count
router.get('/employee/invoiceCount', async (req, res) => {
    const query = "SELECT COUNT(invoiceID) AS invoiceCount FROM Invoice WHERE status='unpaid'";

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

//Fetch task according to logged user

router.get('/api/employee/tasks/:email', async (req, res) => {
    try {
        const { email } = req.params;
        console.log("Received request for email:", email);

        const [employeeResult] = await db.execute(
            'SELECT EmployeeID FROM Employee WHERE Email = ?',
            [email]
        );
        console.log("Employee query result:", employeeResult);

        if (employeeResult.length === 0) {
            console.log("No employee found for email:", email);
            return res.status(404).json({ 
                message: 'Employee not found' 
            });
        }

        const employeeId = employeeResult[0].EmployeeID;
        console.log("Found EmployeeID:", employeeId);

        const [tasksResult] = await db.execute(
            `SELECT 
                TaskID, 
                TaskName, 
                Description, 
                Deadline, 
                BudgetInfo 
            FROM Task 
            WHERE EmployeeID = ?
            ORDER BY Deadline ASC`,
            [employeeId]
        );
        console.log("Tasks query result:", tasksResult);

        res.status(200).json(tasksResult);

    } catch (error) {
        console.error('Error in /api/employee/tasks/:email:', error);
        res.status(500).json({ 
            message: 'Error fetching tasks',
            error: error.message 
        });
    }
});



// Save payment
router.post("/payment", async (req, res) => {
    const sql = `INSERT INTO Payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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

// update invoice status ...
router.put('/update/invoice/:id', async (req, res) => {
    console.log(req.body);
    const sql = "UPDATE Invoice SET status = 'paid' WHERE InvoiceID = ?";
    const invoiceID = req.params.id;

    try {
        const result = await db.query(sql, invoiceID);
        return res.status(200).json({ message: "invoice updated successfully", data: result });
    } catch (error) {
        return res.status(500).send("Error updating data", error.message);
    }
});


//Get all invoice which unpaid
router.get('/employee/invoice', async (req, res) => {
    const sql = 'SELECT * FROM Invoice WHERE status="unpaid"';

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
    const sql = 'SELECT * FROM Payment WHERE EmployeeID =?';
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
    const sql = 'SELECT * FROM Invoice WHERE EmployeeID =?';
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
    const sql = "SELECT * FROM Invoice WHERE InvoiceID = ?";
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
    const sql = "SELECT * FROM Employee WHERE EmployeeID = ?";
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
// Get service
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
    const sql = "SELECT * FROM Employee WHERE email = ?";
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
// search the invoice in searchbar
router.get('/invoices/:input/:empid', async (req, res) => {
    try {
        const input = req.params.input;
        const EmployeeID = req.params.empid;

        const sql = `
            SELECT
                ROW_NUMBER() OVER (ORDER BY Invoice.invoiceID) AS RowNumber,
                Invoice.invoiceID,
                Invoice.EmployeeID,
                Invoice.total_cost,
                DATE_FORMAT(Invoice.invoice_date, '%d-%m-%Y') AS invoice_date,
                Invoice.AcountId,
                Invoice.description,
                Invoice.status
            FROM
                Invoice
            WHERE
                (
                    Invoice.invoiceID = ?
                    OR Invoice.status LIKE CONCAT(?, '%')
                    OR DATE_FORMAT(Invoice.invoice_date, '%d-%m-%Y') LIKE CONCAT(?, '%')
                )
              AND invoice.EmployeeID = ?
        `;

        let queryParam;

        // Handle different input cases
        if (isDDMMYYYYWithDash(input)) {
            const [day, month, year] = input.split('-');
            if (!isValidDateObject(day, month, year)) {
                return res.status(400).json({ message: "Invalid date format" });
            }
            queryParam = `${year}-${month}-${day}`;
        } else if (isYYYYMMDD(input)) {
            queryParam = input;
        } else if (!isNaN(input)) {
            queryParam = input; // Invoice ID
        } else {
            queryParam = input; // Status
        }

        // Execute the query with appropriate parameters
        const [data] = await db.query(sql, [queryParam, queryParam, queryParam, EmployeeID]);

        if (!data.length) {
            return res.status(404).json({ message: "No invoices found" });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

// Route to view all employees ...
router.get('/ViewAllEmployees', (req, res) => {
    try {
        const sql = `SELECT * FROM Employee`;
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
                         ROW_NUMBER() OVER (ORDER BY Employee.EmployeeID) AS RowNumber,
                         Employee.EmployeeID,
                         Employee.name,
                         Employee.email,
                         DATE(Attendance.date) AS date,
                         TIME(Attendance.date) AS time, 
                         CASE
                         WHEN TIME(Attendance.date) >= '08:00:00' AND TIME(Attendance.date) < '09:00:00' THEN 'Attended'
                         WHEN HOUR(Attendance.date) >= '09:00:00' AND TIME(Attendance.date) < '17:00:00' THEN 'Late Attended'
                         ELSE 'Not Attended'
        END AS status
                  FROM 
                      Attendance 
                  INNER JOIN 
                      Employee 
                  ON 
                      Attendance.EmployeeID = Employee.EmployeeID`;

        const [data] = await db.query(sql);
        if(data.length === 0) {
            return res.status(404).send("No attendances found");
        }

        return res.status(200).json(data);
    } catch (err) {
        console.log(err);
        return res.status(500).send("An error occurred while fetching the attendances");
    }
});

// Route to get employee information trough input ...
router.get('/viewEmployees/:input', async (req, res) => {
    try {
        const input = req.params.input;
        const sql = `SELECT * FROM Employee WHERE name = ? OR email = ?`;
        const [data] = await db.query(sql, [input, input]);

        if(data.length === 0) {
            return res.status(404).send("No employee found");
        }

        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send("An error occurred while fetching the employee");
    }
});

// Route to search the attendance ...
router.get('/attendance/:input', async (req, res) => {
    try {
        const input = req.params.input;
        const sql = `SELECT
                         ROW_NUMBER() OVER (ORDER BY Employee.EmployeeID) AS RowNumber,
                         Employee.EmployeeID,
                         Employee.name,
                         Employee.email,
                         DATE(Attendance.date) AS date,
                         TIME(Attendance.date) AS time, 
                         CASE
                         WHEN TIME(Attendance.date) >= '08:00:00' AND TIME(Attendance.date) < '09:00:00' THEN 'Attended'
                         WHEN HOUR(Attendance.date) >= '09:00:00' AND TIME(Attendance.date) < '17:00:00' THEN 'Late Attended'
                         ELSE 'Not Attended'
        END AS status
                  FROM 
                      Attendance 
                  INNER JOIN 
                      Employee 
                  ON 
                      Attendance.EmployeeID = Employee.EmployeeID 
                  WHERE 
                      (Employee.name LIKE CONCAT(?, '%')  -- Matches names starting with the entered text
                      OR Employee.email LIKE CONCAT(?, '%')  -- Matches emails starting with the entered text
                      OR DATE(Attendance.date) LIKE CONCAT(?, '%'))  -- Matches dates starting with the entered text`;

        if (isDDMMYYYYWithDash(input)) {
            const [day, month, year] = input.split('-');
            const formattedDate = `${year}-${month}-${day}`;
            const [data] = await db.query(sql, [formattedDate, formattedDate, formattedDate]);
            if(data.length === 0) {
                return res.status(404).send("No attendance found");
            }

            return res.status(200).json(data);
        } else if (isYYYYMMDD(input)) {
            const [data] = await db.query(sql, [input, input, input]);
            if(data.length === 0) {
                return res.status(404).send("No attendance found");
            }
            return res.status(200).json(data);
        } else {
            const [data] = await db.query(sql, [input, input, input]);
            if(data.length === 0) {
                return res.status(404).send("No attendance found");
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

        // Debug timezone information
        const current_date = new Date();
        console.log('Server Timezone Offset:', current_date.getTimezoneOffset());
        console.log('Server Current Time:', current_date.toString());
        console.log('UTC Time:', current_date.toUTCString());

        // Convert to your local timezone (replace 'Asia/Kolkata' with your timezone)
        const localTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
        const localDate = new Date(localTime);
        
        const hour = localDate.getHours();
        const minute = localDate.getMinutes();
        const second = localDate.getSeconds();

        console.log('Local Time:', localTime);
        console.log('Hour after conversion:', hour);

        const fullDateTime = `${date} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
        console.log('Full DateTime:', fullDateTime);

        // First check if the employee already added attendance
        const sql1 = "SELECT COUNT(*) AS count FROM Attendance WHERE Date(Date) = ? AND Name = ? AND Email = ?";
        const result = await db.query(sql1, [date, name, email]);
        console.log("Count:", result[0][0].count);
        const count = result[0][0].count;
        
        if(count === 1) {
            return res.status(401).send("Attendance already added for the Employee for today!");
        } else {
            if(hour >= 8 && hour < 17) {
                const sql2 = `INSERT INTO Attendance (EmployeeID, Name, Email, Date) VALUES (?, ?, ?, ?)`;
                await db.query(sql2, [employeeId, name, email, fullDateTime]);
                return res.status(200).send("Attendance added successfully!");
            } else {
                return res.status(401).send("You can't mark attendance at this time. It can be done from 8am to 5pm !");
            }
        }
    } catch(error) {
        console.log('Error:', error.message);
        return res.status(500).send("An error occurred while adding attendance record!");
    }
});

export default router;
