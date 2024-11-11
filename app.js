const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const db = require('./config/db'); // Adjust path as necessary
const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs'); // This line sets EJS as the template engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());




// Import routes
const authRoutes = require('./routes/auth');
app.use('/', authRoutes); // Use authentication routes

const logoutRoutes = require('./routes/logout');
app.use('/', logoutRoutes); // Use logout routes

const tdRoutes = require('./routes/td');
app.use('/', tdRoutes); // Use tasks routes

const addtaskRoutes = require('./routes/addtask');
app.use('/', addtaskRoutes); // Use add tasks route

const alltaskRoutes = require('./routes/alltask');
app.use('/', alltaskRoutes); // Use all tasks route


const cmptaskRoutes = require('./routes/cmptask');
app.use('/', cmptaskRoutes); // Use completed task route

const odtaskRoutes = require('./routes/odtask');
app.use('/', odtaskRoutes); // Use overdue task route

const pgtaskRoutes = require('./routes/pgtask');
app.use('/', pgtaskRoutes); // Use pending task route

const sdtaskRoutes = require('./routes/sdtask');
app.use('/', sdtaskRoutes); // Use send task route

const timecardRoutes = require('./routes/timecard');
app.use('/', timecardRoutes); // Use timecard route

const addempRoutes = require('./routes/addemp');
app.use('/', addempRoutes); // Use add employee route

const emplistRoutes = require('./routes/emplist');
app.use('/', emplistRoutes); // Use employee list route

const leadsRoutes = require('./routes/leads');
app.use('/', leadsRoutes); // Use leads routes

const dashboardRoutes = require('./routes/dashboard');
app.use('/', dashboardRoutes); // Use dashboard routes

const settingsRoutes = require('./routes/settings');
app.use('/', settingsRoutes); // Use settings routes

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Redirect to registration on root
app.get('/', (req, res) => {
    res.redirect('/login');
});
