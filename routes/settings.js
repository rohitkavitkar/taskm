const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Settings Routes
router.get('/settings/location', (req, res) => {
    res.render('layout', { title: 'Add Location', content: 'settings/add-location' });
});

module.exports = router;