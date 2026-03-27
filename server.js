import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import rbacRoutes from './routes/rbacRoutes.js';

// Import local modules
import apiRoutes from './routes/index.js';
import pool from './config/db.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ 1. MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ 2. STATIC FILES SETUP
// Priority 1: Serve CSS/JS/Images from 'public' (e.g. /css/style.css)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/admin', rbacRoutes); 


// Priority 2: Serve HTML files from 'public/pages' with extension support
// This allows both /profile and /profile.html to work automatically
app.use(express.static(path.join(__dirname, 'public', 'pages'), { 
    extensions: ['html'] 
}));

// ✅ 3. FRONTEND PAGE ROUTES (Manual fallbacks for clean navigation)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

// These explicit routes ensure absolute reliability
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'register.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'profile.html'));
});

// ✅ 4. DATABASE CONNECTION CHECK
const checkDbConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        // Fixed: res.rows[0].now instead of res.rows.now
        console.log('✅ Database Connected:', res.rows[0].now);
    } catch (err) {
        console.error('❌ Database Connection Error:', err.message);
        process.exit(1);
    }
};
checkDbConnection();

// ✅ 5. API ROUTES
app.use('/api', apiRoutes);

// ✅ 6. HEALTH CHECK
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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`👉 Access Login: http://localhost:${PORT}/login`);
});
