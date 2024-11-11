const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Employee List route
router.get('/employee/list', (req, res) => {
    res.render('layout', { title: 'Employee List', content: 'employee/employee-list' });
});

// Fetch all employee data from MySQL
router.get('/employees', (req, res) => {
    const query = 'SELECT id, name, employee_type, email, phone FROM employees';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from the database:', err);
            return res.status(500).send('Database error');
        }
        res.json(results);
    });
});

// Fetch a specific employee's details by ID
router.get('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const query = 'SELECT id, name, employee_type, email, phone FROM employees WHERE id = ?';
    
    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching employee data:', err);
            return res.status(500).send('Database error');
        }
        if (results.length === 0) {
            return res.status(404).send('Employee not found');
        }
        res.json(results[0]);
    });
});

// Update employee details
router.put('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const { name, employee_type, email, phone } = req.body;

    const query = 'UPDATE employees SET name = ?, employee_type = ?, email = ?, phone = ? WHERE id = ?';
    
    db.query(query, [name, employee_type, email, phone, employeeId], (err, results) => {
        if (err) {
            console.error('Error updating employee data:', err);
            return res.status(500).send('Database error');
        }
        res.sendStatus(204); // No Content
    });
});

// Delete an employee by ID
router.delete('/employees/:id', (req, res) => {
    const employeeId = req.params.id;
    const query = 'DELETE FROM employees WHERE id = ?';

    db.query(query, [employeeId], (err, results) => {
        if (err) {
            console.error('Error deleting employee data:', err);
            return res.status(500).send('Database error');
        }
        if (results.affectedRows === 0) {
            return res.status(404).send('Employee not found');
        }
        res.sendStatus(204); // No Content
    });
});

module.exports = router;