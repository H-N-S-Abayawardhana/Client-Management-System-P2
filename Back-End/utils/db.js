import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: 'cms-gr-hnsabayawardhana-9d94.l.aivencloud.com',
    user: 'avnadmin',
    password: 'AVNS__JAfuRWH6GzBBowVrG0',
    database: 'defaultdb',
    port: 11324,
    ssl: {
        rejectUnauthorized: false  // Changed this line
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test the pool connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Database connected successfully');
    connection.release();
});

// Handle pool errors
pool.on('error', (err) => {
    console.error('Database pool error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.');
    }
});

// Handle process termination
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing pool:', err);
        }
        console.log('Pool connections terminated');
        process.exit(0);
    });
});

export default pool.promise();