import express from "express";
import db from "../utils/db.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to fetch employee data
router.get("/:id", async (req, res) => {
  const employeeID = req.params.id;
  console.log("Route accessed with ID:", employeeID);

  try{
    const [rows] = await db.query(`
      SELECT 
        Name As EmployeeName,
        Designation As Designation,
        Email,
        Name ,
        ContactNumber,
        Address,
        WorkStartDate,
        EmployeeID
      FROM Employee
      WHERE EmployeeID = ?`,
      [employeeID]
    );
    if (!rows.length){
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Database error", err);
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
