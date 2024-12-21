import mysql from 'mysql2';

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '', // Enter your password here if required
    database: 'Client_Management_System',
    port: 3308, // Specify the port explicitly
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err.message);
    } else {
        console.log('Database connected successfully!');
        connection.release();
    }
});
