import express from 'express';
import nodemailer from 'nodemailer';
import 'dotenv/config';

const router = express.Router();

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: "gmail", 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS  
    },
    tls: {
        rejectUnauthorized: false,  // Disables certificate validation (use cautiously)
    }
});
  
// API Route to Send Email
router.post("/sendMail", async (req, res) => {
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

export default router;