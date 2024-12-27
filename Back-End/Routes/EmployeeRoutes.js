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

 


// Get tasks for the logged-in employee
router.get("/tasks", authenticateToken, async (req, res) => {
  if (req.user.userType !== 'Employee') {
    return res.status(403).json({ message: 'Access denied.' });
  }

  try {
    const [tasks] = await con.query('SELECT * FROM Task WHERE EmployeeID = ?', [req.user.id]);
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
