const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Settings Routes
router.get('/tasks/completed-task', (req, res) => {
    res.render('layout', { title: 'Completed Tasks', content: 'tasks/completed-task' });
});

module.exports = router;