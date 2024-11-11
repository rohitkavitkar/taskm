// Load environment variables from .env file
require('dotenv').config();
const mysql = require('mysql');

// Configure the MySQL connection using environment variables
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root123',
    database: process.env.DB_NAME || 'login',
    port: process.env.DB_PORT || 3306
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to database!');
});

module.exports = db;
