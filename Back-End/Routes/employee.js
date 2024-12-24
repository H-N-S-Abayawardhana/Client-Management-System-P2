import express from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import {db} from '../utils/db.js';

const router = express.Router();



export default router; // Use default export for ES Modules

