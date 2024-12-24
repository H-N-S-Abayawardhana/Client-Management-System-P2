import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import authRoutes from './Routes/auth.js';
import adminRoutes from './Routes/admin.js'; 
import EmployeeRoutes from './Routes/EmployeeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/employee', EmployeeRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Client Management System API is running.');
});

app.listen(5000, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




