import express from "express";
import db from "../utils/db.js";
import authenticateToken from "../middleware/authMiddleware.js";

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
// router.post("/payment", (req, res) => {
//   const {
//     invoiceID,
//     EmployeeID,
//     card_holder_name,
//     card_number,
//     expiry_date,
//     cvc,
//     amount,
//     payment_status,
//     payment_date
//   } = req.body;
//
//   const query = `INSERT INTO payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
//   db.query(query, [
//     invoiceID,
//     EmployeeID,
//     card_holder_name,
//     card_number,
//     expiry_date,
//     cvc,
//     amount,
//     payment_status,
//     payment_date
//   ], (err, result) => {
//     if (err) {
//       console.error("Error inserting payment data:", err.message);
//       return res.status(500).json({
//         message: "Error inserting payment data",
//         error: err.message
//       });
//     }
//
//     if (result.affectedRows === 0) {
//       console.log(result);
//       return res.status(400).json({ message: "Failed to add payment" });
//     }
//
//     res.status(201).json({
//       message: "Payment added successfully",
//       data: result
//     });
//   });
// });

router.post("/payment", async (req, res) => {
  const sql = "INSERT INTO payment (invoiceID, EmployeeID, card_holder_name, card_number, expiry_date, cvc, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.invoiceID,
    req.body.EmployeeID,
    req.body.card_holder_name,
    req.body.card_number,
    req.body.expiry_date,
    req.body.cvc,
    req.body.amount,
    req.body.payment_status,
    req.body.payment_date
  ];

  db.query(sql, values, (err, data) => {
    console.log(data);
    if (err) {
      console.error("Error inserting payment data:", err.message);
      return res.status(500).json({
        success: false,
        message: "Error inserting data into database",
        details: err.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Payment added successfully",
      data: data // Sending back the response data
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


export default router;
