const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

router.get('/tasks/overdue-task', (req, res) => {
    res.render('layout', { title: 'Overdue Tasks', content: 'tasks/overdue-task' });
});

module.exports = router;