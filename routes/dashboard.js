const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// dashboard Route
router.get('/dashboard', (req, res) => {
    res.render('layout', { title: 'Dashboard', content: 'dashboard' });
});

module.exports = router;