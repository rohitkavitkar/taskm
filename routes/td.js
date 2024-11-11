const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');


router.get('/tasks/today-task', (req, res) => {
    res.render('layout', { title: 'Today Tasks', content: 'tasks/today-task' });
});

module.exports = router;