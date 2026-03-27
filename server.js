import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Import RBAC and API routes
import rbacRoutes from './routes/rbacRoutes.js';
import apiRoutes from './routes/index.js';
import pool from './config/db.js';

// Setup __dirname for ES Modules (Required for Render/Linux)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. CORE MIDDLEWARES
app.use(cors());
app.use(express.json()); // Essential for parsing POST request bodies
app.use(morgan('dev'));  // Logs requests to the console

// ✅ 2. API ROUTES (Mount before Static files)
app.use('/api/admin', rbacRoutes); 
app.use('/api', apiRoutes);

// ✅ 3. STATIC FILES SETUP
// Serves CSS, JS, and Images from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serves HTML files from 'public/pages' (allows /profile instead of /profile.html)
app.use(express.static(path.join(__dirname, 'public', 'pages'), { 
    extensions: ['html'] 
}));

// ✅ 4. FRONTEND PAGE FALLBACKS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));
});

// ✅ 5. DATABASE CONNECTION CHECK (Initial Startup)
const checkDbConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL Connected to Neon:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
        // On Render, we want to know why it failed, but let the health check handle restarts
    }
};
checkDbConnection();

// ✅ 6. HEALTH CHECK (Used by Render to monitor uptime)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// ✅ 7. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    console.error('💥 Global Error:', err.stack);
    res.status(500).json({ 
        message: 'Something went wrong on the server',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// ✅ 8. START SERVER
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    if (process.env.NODE_ENV !== 'production') {
        console.log(`👉 Local Access: http://localhost:${PORT}/login`);
    }
});
