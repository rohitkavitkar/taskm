const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Settings Routes
router.get('/tasks/send-task', (req, res) => {
    res.render('layout', { title: 'Send Tasks', content: 'tasks/send-task' });
});


module.exports = router;