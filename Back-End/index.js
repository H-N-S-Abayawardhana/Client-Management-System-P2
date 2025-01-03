import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';


import authRoutes from './Routes/auth.js';
import adminRoutes from './Routes/AdminRoutes.js'; 
import employeeRoutes from './Routes/EmployeeRoutes.js';
import emailRoutes from './Routes/EmailRoute.js';
import ContactUsRoute from './Routes/ContactUsRoute.js';

//Tasks
import AdminTaskRoutes from './Routes/AdminTaskRoutes.js'; // Import AdminRoutes.
import EmployeeTaskProgressRoutes from './Routes/EmployeeTaskProgressRoutes.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/contact', ContactUsRoute);

app.options('/api/email/send-email', cors());
// app.options('/api/contact/sendMail', cors());

// Task Management Routes
app.use('/admin/task', AdminTaskRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/employee/task', EmployeeTaskProgressRoutes);
//Service

// Default route
app.get('/', (req, res) => {
    res.send('Client Management System API is running.');
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




