import express from "express";
import db from "../utils/db.js";
import authenticateToken from "../middleware/authMiddleware.js";
import { isDDMMYYYYWithDash, isYYYYMMDD } from "../utils/formatDate.js";

const router = express.Router();

// New route to get current user data
router.get("/current/profile", async (req, res) => {
  try {
    // Get the most recent active session (no logout time)
    const [sessions] = await db.query(`
      SELECT UserID, UserType 
      FROM sessionlogs 
      WHERE LogoutTime IS NULL 
      ORDER BY LoginTime DESC 
      LIMIT 1
    `);

    if (!sessions.length) {
      return res.status(401).json({ message: "No active session found" });
    }

    const { UserID, UserType } = sessions[0];

    // If user is an employee, query employee table
    if (UserType === 'Employee') {
      const [employees] = await db.query(`
        SELECT 
          Name,
          Designation,
          Email,
          ContactNumber,
          Address,
          WorkStartDate,
          EmployeeID
        FROM Employee
        WHERE EmployeeID = ?`,
        [UserID]
      );

      if (!employees.length) {
        return res.status(404).json({ message: "Employee not found" });
      }

      res.json(employees[0]);
    } else {
      // Handle admin case if needed
      return res.status(400).json({ message: "Invalid user type for this endpoint" });
    }

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

// Fetch attendance count
router.get('/employee/attendCount', async (req, res) => {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(currentDate);

        const query = "SELECT COUNT(AttendanceID) AS attendCount FROM attendance WHERE Date = ?";
        const [data] = await db.query(query, [currentDate]); 

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
router.post("/emp/payment", (req, res) => {
  const {
    invoiceID,
    EmployeeID,
    card_holder_name,
    card_number,
    expiry_date,
    cvc,
    amount,
    payment_status,
    payment_date
  } = req.body;

  const query = `INSERT INTO payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [
    invoiceID,
    EmployeeID,
    card_holder_name,
    card_number,
    expiry_date,
    cvc,
    amount,
    payment_status,
    payment_date
  ], (err, result) => {
    if (err) {
      console.error("Error inserting payment data:", err.message);
      return res.status(500).json({
        message: "Error inserting payment data",
        error: err.message
      });
    }
      console.log(result);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to add payment" });
    }

    res.status(201).json({
      message: "Payment added successfully",
      data: result
    });
  });
});

// router.post("/payment", async (req, res) => {
//   const sql = "INSERT INTO payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
//   const values = [
//     req.body.invoiceID,
//     req.body.EmployeeID,
//     req.body.card_holder_name,
//     req.body.card_number,
//     req.body.expiry_date,
//     req.body.cvc,
//     req.body.amount,
//     req.body.payment_status,
//     req.body.payment_date
//   ];
//
//   db.query(sql, values, (err, data) => {
//     console.log(data);
//     if (err) {
//       console.error("Error inserting payment data:", err.message);
//       return res.status(500).json({
//         success: false,
//         message: "Error inserting data into database",
//         details: err.message
//       });
//     }
//
//     return res.status(201).json({
//       success: true,
//       message: "Payment added successfully",
//       data: data // Sending back the response data
//     });
//   });
// });
router.post("/payment", async (req, res) => {
    const sql = `
      INSERT INTO payment 
      (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        req.body.invoiceID,
        req.body.EmployeeID,
        req.body.card_holder_name,
        req.body.card_number,
        req.body.expiry_date,
        req.body.cvc,
        req.body.amount,
        req.body.payment_status,
        req.body.payment_date,
    ];

    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error inserting payment data:", err.message);
            return res.status(500).json({
                success: false,
                message: "Error inserting data into database",
                details: err.message,
            });
        }

        // Ensure the response has the correct structure
        res.status(200).json({
            success: true,
            message: "Payment added successfully",
            data: { insertId: data.insertId }, // Send relevant data back
        });
    });
});
//Get all invoice
router.get('/employee/invoice', async (req, res) => {
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

// Route to add new attendance record ...
router.post('/addAttendance', async (req, res) => {
  try {
      const { name, date, email } = req.body;

      const current_date = new Date();
      const hour = current_date.getHours();
      const minute = current_date.getMinutes();
      const second = current_date.getSeconds();

      // Concatenate the `date` with the current time in HH:mm:ss format ...
      const fullDateTime = `${date} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
      console.log(name, date, email, hour, minute, second, fullDateTime);

      // check whether the user is already existing ...
      const sql1 = `SELECT EmployeeID FROM employee WHERE Name = ? AND Email = ?`;
      const [data] = await db.query(sql1, [name, email]);
      if(data.length === 0) {
        return res.json({ message: "Employee not found!"});
      }
      
      console.log(result.length);
      console.log(result[0]);
      console.log(result[0].EmployeeID);    

      const EmployeeId = result[0].EmployeeID;
      console.log("EmployeeId : ", EmployeeId);

      if(hour >= 8 && hour < 17) {
        // Insert the new attendance record into the database ...
        const sql2 = `INSERT INTO attendance (EmployeeID, Date) VALUES (?,?)`;
        await db.query(sql2, [EmployeeId, fullDateTime]);
        return res.json({ message: "Attendance added successfully!"});
      } else {
        return res.json({ message: "You can't mark attendance at this time. It can be done from 8am to 5pm !"});
      }
  } catch(error) {
      console.log(error.message);
      return res.json({ message: "An error occurred while adding attendance record!"});
  }
});

export default router;
