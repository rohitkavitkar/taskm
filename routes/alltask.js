const express = require('express');
const db = require('../config/db');
const router = express.Router();
const bcrypt = require('bcryptjs');


// Helper function to convert 12-hour time format to 24-hour format
function convertTo24Hour(time) {
    if (!time) return null;
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':');
    
    if (modifier === 'PM' && hours !== '12') {
        hours = parseInt(hours, 10) + 12;
    }
    if (modifier === 'AM' && hours === '12') {
        hours = '00';
    }
    return `${hours}:${minutes}:00`;
}

// Route to render the all tasks page
router.get('/tasks/all-task', (req, res) => {
    res.render('layout', { title: 'All Tasks', content: 'tasks/all-task' });
});

// Fetch all tasks with filtering options
router.get('/tasks', (req, res) => {
    const { startDate, endDate, employeeId } = req.query;

    let query = `
        SELECT 
            t.id,
            t.title,
            t.description,
            t.start_date,
            t.start_time,
            t.deadline_date,
            t.end_time,
            t.reminder_date,
            t.reminder_time,
            t.frequency,
            t.task_interval,
            t.cycle,
            e.name AS assign_to,
            e.id AS assign_to_id
        FROM tasks t
        LEFT JOIN employees e ON t.assign_to = e.id
        WHERE 1=1
    `;

    const params = [];
    if (startDate) {
        query += ' AND DATE(t.start_date) >= ?';
        params.push(startDate);
    }
    if (endDate) {
        query += ' AND DATE(t.deadline_date) <= ?';
        params.push(endDate);
    }
    if (employeeId) {
        query += ' AND t.assign_to = ?';
        params.push(employeeId);
    }

    query += ' ORDER BY t.deadline_date ASC';

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return res.status(500).json({ error: 'Database query error' });
        }

        const tasksWithStatus = results.map(task => ({
            ...task,
            status: determineTaskStatus(task)
        }));

        res.json(tasksWithStatus);
    });
});

// Update task details
router.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const {
        title,
        description,
        start_date,
        start_time,
        deadline_date,
        end_time,
        reminder_date,
        reminder_time,
        assign_to,
        frequency,
        task_interval,
        cycle
    } = req.body;

    const startTime24 = convertTo24Hour(start_time);
    const endTime24 = convertTo24Hour(end_time);
    const reminderTime24 = convertTo24Hour(reminder_time);

    // Check if description is provided, if not, set it to an empty string or a default value
    const taskDescription = description || ''; // or use some default value if needed

    const query = `
        UPDATE tasks 
        SET 
            title = ?,
            description = ?,
            start_date = ?,
            start_time = ?,
            deadline_date = ?,
            end_time = ?,
            reminder_date = ?,
            reminder_time = ?,
            assign_to = ?,
            frequency = ?,
            task_interval = ?,
            cycle = ?
        WHERE id = ?
    `;

    const params = [
        title,
        taskDescription,
        start_date,
        startTime24,
        deadline_date,
        endTime24,
        reminder_date || null,
        reminderTime24 || null,
        assign_to,
        frequency || null,
        task_interval || null,
        cycle || null,
        taskId
    ];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating task data:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.sendStatus(204);
    });
});

// Delete a task by ID
router.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const query = 'DELETE FROM tasks WHERE id = ?';

    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.sendStatus(204);
    });
});

// Update task details
router.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const {
        title,
        description,
        start_date,
        start_time,
        deadline_date,
        end_time,
        reminder_date,
        reminder_time,
        assign_to,
        frequency,
        task_interval,
        cycle
    } = req.body;

    const query = `
        UPDATE tasks 
        SET 
            title = ?,
            description = ?,
            start_date = ?,
            start_time = ?,
            deadline_date = ?,
            end_time = ?,
            reminder_date = ?,
            reminder_time = ?,
            assign_to = ?,
            frequency = ?,
            task_interval = ?,
            cycle = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    const params = [
        title,
        description,
        start_date,
        start_time,
        deadline_date,
        end_time,
        reminder_date || null,
        reminder_time || null,
        assign_to,
        frequency || null,
        task_interval || null,
        cycle || null,
        taskId
    ];

    db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error updating task data:', err);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.sendStatus(204); // No Content
    });
});

// Delete a task by ID
router.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const query = 'DELETE FROM tasks WHERE id = ?';

    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('Error deleting task:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.sendStatus(204); // No Content
    });
});

// Get task by ID
router.get('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const query = `
        SELECT 
            t.id,
            t.title,
            t.description,
            t.start_date,
            t.start_time,
            t.deadline_date,
            t.end_time,
            t.reminder_date,
            t.reminder_time,
            t.assign_to,
            t.frequency,
            t.task_interval,
            t.cycle,
            e.name AS employee_name
        FROM tasks t
        LEFT JOIN employees e ON t.assign_to = e.id
        WHERE t.id = ?
    `;
    
    db.query(query, [taskId], (err, results) => {
        if (err) {
            console.error('Error fetching task data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.json(results[0]);
    });
});

// Function to determine task status with more detailed logic
function determineTaskStatus(task) {
    const today = new Date();
    const deadline = new Date(`${task.deadline_date} ${task.end_time || '23:59:59'}`);
    const startDate = new Date(`${task.start_date} ${task.start_time || '00:00:00'}`);

    if (today < startDate) {
        return 'Scheduled';
    } else if (today > deadline) {
        return 'Overdue';
    } else {
        return 'In Progress';
    }
}

module.exports = router;