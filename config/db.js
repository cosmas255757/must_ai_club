import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// ✅ Optimized for Neon & Render
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Neon requires SSL. This config works for both Local and Production.
    ssl: process.env.DATABASE_URL.includes('localhost') 
        ? false 
        : { rejectUnauthorized: false }
});

// ✅ Log successful connection
pool.on('connect', () => {
    console.log('✅ PostgreSQL Pool Connected to Neon');
});

// ✅ Critical: Handle errors on idle clients
pool.on('error', (err) => {
    console.error('❌ Unexpected database error on idle client', err);
    // Don't exit in production unless it's a fatal startup error
    if (process.env.NODE_ENV !== 'production') process.exit(-1);
});

export default pool;
