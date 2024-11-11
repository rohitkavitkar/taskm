const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

// Employee Routes



// Time Card route
router.get('/employee/timecard', (req, res) => {
    res.render('layout', { title: 'Time Card', content: 'employee/timecard' });
});

module.exports = router;
