import express from "express";
import con from "../utils/db.js";
import authenticateToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Route to fetch employee data
router.get("/:id", (req, res) => {
  const employeeID = req.params.id;

  const query = "SELECT * FROM Employee WHERE EmployeeID = ?";
  con.query(query, [employeeID], (err, result) => {
    if (err) {
      console.error("Error fetching employee data:", err);
      res.status(500).send("Error fetching employee data");
    } else {
      res.json(result[0]);
    }
  });
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
