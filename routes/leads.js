const express = require('express');
const bcrypt = require('bcryptjs');

const db = require('../config/db'); // Adjust path as necessary
const router = express.Router();

const path = require('path');

// Leads Routes
router.get('/leads/create', (req, res) => {
    res.render('layout', { title: 'Create Lead', content: 'leads/create-leads' });
});

router.get('/leads/list', (req, res) => {
    res.render('layout', { title: 'Lead List', content: 'leads/lead-list' });
});

module.exports = router;