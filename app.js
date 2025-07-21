require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const path = require('path');

const app = express();

// Simple Logging Middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        // Log only API calls, not static file requests
        if (req.originalUrl.startsWith('/api')) {
            console.log(`${new Date().toISOString()} | ${req.method} ${req.originalUrl} - ${res.statusCode} [${duration}ms]`);
        }
    });
    next();
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Database Connection Test
sequelize.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/courses', require('./routes/course.routes'));
app.use('/api/catalogs', require('./routes/catalog.routes'));
app.use('/api/scorm-packages', require('./routes/scormPackage.routes'));
// TODO: Add routes for auth, catalog, courses, etc.

// Fallback to serve index.html for any other GET request, for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 