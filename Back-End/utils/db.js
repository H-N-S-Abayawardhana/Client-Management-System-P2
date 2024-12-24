import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'Client_Management_System',
    port: process.env.DB_PORT || 3306, // Default to 3306 if not specified
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed: ', err);
        return;
    }
    console.log('Connected to the database');
    connection.release(); // Release the connection back to the pool
});

export default pool.promise();
