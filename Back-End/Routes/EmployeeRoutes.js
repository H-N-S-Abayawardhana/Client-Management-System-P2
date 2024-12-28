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



export default router;
