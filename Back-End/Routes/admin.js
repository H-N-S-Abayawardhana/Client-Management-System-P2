import express from 'express';
import bcrypt from 'bcryptjs';
import authenticateToken from '../middleware/authMiddleware.js';
import db from '../utils/db.js';

const router = express.Router();



// Get All Payments
router.get("/payment", async (req, res) => {
    try {
        const sql = "SELECT * FROM Payment";
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
    const sql = "SELECT * FROM Payment WHERE paymentID = ?";
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
    const sql = "DELETE FROM Payment WHERE paymentID = ?";
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
    const sql = "SELECT * FROM Invoice WHERE invoiceID = ?";
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

export default router;


