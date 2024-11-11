const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Route to serve the add employee form
router.get('/employee/add', (req, res) => {
    res.render('layout', { title: 'Add Employee', content: 'employee/add-employee' });
});

// Handle form submission
router.post('/employee/add', async (req, res) => {
    const { name, email, password, phone, salary, dailyShift, totalDays, hourlyRate, ordinaryEmployee, salesEmployee } = req.body;

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine the employee type
    let employeeType = '';
    if (ordinaryEmployee) employeeType += 'Ordinary Employee ';
    if (salesEmployee) employeeType += 'Sales Employee';

    // Prepare the SQL query
    let query = `
        INSERT INTO employees (name, email, password, phone, employee_type
    `;
    
    let values = [name, email, hashedPassword, phone, employeeType.trim()];

    // Add salary-related fields only if they are provided
    if (salary) {
        query += `, salary`;
        values.push(salary);
    }
    if (dailyShift) {
        query += `, daily_shift`;
        values.push(dailyShift);
    }
    if (totalDays) {
        query += `, total_days`;
        values.push(totalDays);
    }
    if (hourlyRate) {
        query += `, hourly_rate`;
        values.push(hourlyRate);
    }

    query += `) VALUES (?${', ?'.repeat(values.length - 1)})`; // Create placeholders for values

    db.query(query, values, (err, result) => {
        if (err) throw err;
        console.log('Employee created:', result.insertId);
        res.redirect('/employee/list'); // Redirect to the employee list page after success
    });
});

module.exports = router;