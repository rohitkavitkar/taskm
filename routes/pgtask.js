const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

router.get('/tasks/pending-task', (req, res) => {
    res.render('layout', { title: 'Pending Tasks', content: 'tasks/pending-task' });
});


module.exports = router;