import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST || '127.0.0.1',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'Client_Management_System',
//     port: process.env.DB_PORT || 3308,
// });

const pool = mysql.createPool({
    host: 'localhost',
    user: 'Suchith',
    password: '+1234SSe',
    database: 'Client_Management_System',
    port: 3307,
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Database connected successfully');
    connection.release();
});

// Add error listeners
pool.on('error', (err) => {
    console.error('Pool error:', err);
});

export default pool.promise();
