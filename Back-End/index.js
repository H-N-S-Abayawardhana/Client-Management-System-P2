import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './Routes/auth.js';
import adminRoutes from './Routes/admin.js'; 
import employeeRoutes from './Routes/employee.js';

//Tasks
import AdminTaskRoutes from './Routes/AdminTaskRoutes.js'; // Import AdminRoutes.
import EmployeeTaskProgressRoutes from './Routes/EmployeeTaskProgressRoutes.js';

//Service
import AdminServiceRoutes from './Routes/AdminServiceRoutes.js'

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


// Task Management Routes
app.use('/admin/task', AdminTaskRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/employee/task', EmployeeTaskProgressRoutes);
//Service
app.use('/admin/service', AdminServiceRoutes)

// Default route
app.get('/', (req, res) => {
    res.send('Client Management System API is running.');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




