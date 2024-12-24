import express from "express";
import con from "../utils/db.js"; 

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

export default router;
