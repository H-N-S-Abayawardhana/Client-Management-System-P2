import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './Routes/auth.js';
import adminRoutes from './Routes/AdminRoutes.js'; 
import employeeRoutes from './Routes/EmployeeRoutes.js';
import emailRoutes from './Routes/EmailRoute.js';
import ContactUsRoute from './Routes/ContactUsRoute.js';

//Tasks
import AdminTaskRoutes from './Routes/AdminTaskRoutes.js';
import EmployeeTaskProgressRoutes from './Routes/EmployeeTaskProgressRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ['https://gamage-recruiters-cms.netlify.app'], // No trailing slash
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight requests
  credentials: true, // Allow credentials like cookies
}));
app.use(bodyParser.json());

// Preflight Handling (Optional but Recommended)
app.options('*', cors()); // Handle preflight requests for all routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/contact', ContactUsRoute);

// Task Management Routes
app.use('/admin/task', AdminTaskRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/employee/task', EmployeeTaskProgressRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Client Management System API is running.');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
