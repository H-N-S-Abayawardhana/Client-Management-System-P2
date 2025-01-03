import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create uploads directory if it doesn't exist
        const dir = 'uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Create unique filename
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Allow only certain file types
        const allowedTypes = [
            'application/pdf',
            'image/jpeg',
            'image/png',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DOC/DOCX files are allowed.'));
        }
    }
});

// Email sending route
router.post("/send-email", upload.single("attachment"), async (req, res) => {
    const { to, subject, message } = req.body;
    const attachment = req.file;

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    try {
        // Validate email inputs
        if (!to || !subject || !message) {
            throw new Error('Missing required fields: to, subject, and message are required');
        }

        // Configure email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text: message,
            attachments: attachment
                ? [{
                    filename: attachment.originalname,
                    path: attachment.path,
                    contentType: attachment.mimetype,
                }]
                : [],
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Clean up attachment file if it exists
        if (attachment && fs.existsSync(attachment.path)) {
            fs.unlinkSync(attachment.path);
        }

        // Send success response
        res.status(200).json({ 
            success: true, 
            message: "Email sent successfully" 
        });

    } catch (error) {
        console.error("Error sending email:", error);

        // Clean up attachment file if it exists
        if (attachment && fs.existsSync(attachment.path)) {
            fs.unlinkSync(attachment.path);
        }

        // Send appropriate error response
        if (error.message.includes('Missing required fields')) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        } else if (error.code === 'EAUTH') {
            res.status(401).json({
                success: false,
                message: "Email authentication failed. Please check your credentials."
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to send email",
                error: error.message
            });
        }
    }
});

// Test route to verify email configuration
router.get("/test-config", (req, res) => {
    try {
        const emailConfig = {
            service: "gmail",
            user: process.env.EMAIL_USER ? "configured" : "missing",
            pass: process.env.EMAIL_PASS ? "configured" : "missing"
        };
        res.json({
            status: "Email configuration test",
            config: emailConfig
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Failed to test email configuration",
            error: error.message
        });
    }
});

export default router;