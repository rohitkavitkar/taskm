// Task Management/routes/navbar.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');




// Logout Route
router.get('/logout', (req, res) => {
    // Handle logout logic here
    res.redirect('/login');
});

// Export the router
module.exports = router;
