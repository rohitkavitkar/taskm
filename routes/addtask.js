const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();
const multer = require('multer');

const path = require('path');

router.get('/tasks/add-task', (req, res) => {
    res.render('layout', { title: 'Add Task', content: 'tasks/add-task' });
});
// Set up storage engine for multer (file uploads)
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use original filename
    }
});

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
}).single('file'); // Ensure form field name matches HTML

// Route for fetching users to populate the "Assign To" dropdown
router.get('/api/users', (req, res) => {
    const query = 'SELECT id, name FROM employees'; // Adjust the query based on your users table structure
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Error fetching users');
        }
        res.json(results); // Send the results as JSON
    });
});

// Route for handling task creation form submission
router.post('/add', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).send('Error uploading file');
        }

        const { 
            title, 
            description, 
            assignTo, 
            start_date, 
            start_hours, 
            start_minutes, 
            start_am_pm, 
            deadline_date, 
            end_hours, 
            end_minutes, 
            end_am_pm, 
            reminder_date, 
            reminder_hours, 
            reminder_minutes, 
            reminder_am_pm, 
            frequency, 
            task_interval, 
            cycle 
        } = req.body;

        // Convert times to 24-hour format
        const startTime = convertTo24Hour(start_hours, start_minutes, start_am_pm);
        const endTime = convertTo24Hour(end_hours, end_minutes, end_am_pm);
        const reminderTime = reminder_date ? convertTo24Hour(reminder_hours, reminder_minutes, reminder_am_pm) : null;

        const file_path = req.file ? req.file.filename : null;

        // Prepare the query and values
        let query = `INSERT INTO tasks (title, description, assign_to, start_date, start_time, deadline_date, end_time, reminder_date, reminder_time, frequency, task_interval, cycle, file_path)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        // Prepare the values array
        const values = [title, description, assignTo, start_date, startTime, deadline_date, endTime, reminder_date, reminderTime];

        // Check if the recurring fields are filled
        if (req.body.recurring) {
            // If recurring checkbox is checked, include the corresponding fields
            values.push(frequency || null, task_interval || null, cycle || null, file_path);
        } else {
            // If not recurring, push null values for those fields
            values.push(null, null, null, file_path);
        }

        // Execute the query
        db.query(query, values, (err, result) => {
            if (err) {
                return res.status(500).send('Error saving task');
            }

            res.redirect('/tasks/all-task');
        });
    });
});

// Function to convert 12-hour time to 24-hour format
function convertTo24Hour(hours, minutes, amPm) {
    let hour24 = parseInt(hours);
    if (amPm === 'PM' && hour24 !== 12) {
        hour24 += 12;
    }
    if (amPm === 'AM' && hour24 === 12) {
        hour24 = 0;
    }
    return `${hour24}:${minutes}:00`;
}

// Export the router
module.exports = router;