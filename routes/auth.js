const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');


// Route for the registration form (GET request)
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
});

// Registration functionality (POST request)
router.post('/register', async (req, res) => {
    const { name, username, email, password, confirm_password } = req.body;

    // Check if passwords match
    if (password !== confirm_password) {
        return res.send('Passwords do not match!');
    }

    try {
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const sql = 'INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, username, email, hashedPassword], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).send('Internal server error during registration');
            }
            // Redirect to the login page after successful registration
            res.redirect('/login'); // Adjust this path according to your routing setup
        });
    } catch (err) {
        console.error('Error hashing password:', err);
        res.status(500).send('Error occurred during registration');
    }
});


// Route for login form (GET request)
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
});

// Login functionality (POST request)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Fetch user from the database by username
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal server error during login');
        }

        if (results.length > 0) {
            const user = results[0];

            // Compare entered password with stored hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Log the login time into the logins table
                const loginQuery = 'INSERT INTO logins (username) VALUES (?)';
                db.query(loginQuery, [username], (err) => {
                    if (err) {
                        console.error('Error logging login:', err);
                    }
                });
                res.redirect('/dashboard'); // Redirect to your dashboard or another page
            } else {
                // Invalid credentials, redirect with error
                res.redirect('/login?error=1');
            }
        } else {
            // User not found, redirect with error
            res.redirect('/login?error=1');
        }
    });
});

module.exports = router;
