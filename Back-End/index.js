import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';


import authRoutes from './Routes/auth.js';
import adminRoutes from './Routes/AdminRoutes.js'; 
import employeeRoutes from './Routes/EmployeeRoutes.js';
import emailRoutes from './Routes/EmailRoute.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/email', emailRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Client Management System API is running.');
});


// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    }
  });
  
  // API Route to Send Email
  app.post("/api/sendMail", async (req, res) => {
    const { fullName, email, message } = req.body;
  
    try {
      // Define the email options
      const mailOptions = {
        from: process.env.EMAIL_USER, // Sender's email
        to: process.env.EMAIL_USER,   // Recipient (Your email)
        subject: `New Contact Form Submission from ${fullName}`,
        text: `
          You have received a new message from your contact form:
  
          Name: ${fullName}
          Email: ${email}
          Message: ${message}
        `,
      };
  
      // Send the email
      await transporter.sendMail(mailOptions);
  
      // Respond with success message
      res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send email. Please try again." });
    }
  });

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




