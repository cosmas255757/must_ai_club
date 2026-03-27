import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// ✅ Use connectionString to match your DATABASE_URL in .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Add SSL config if you plan to deploy to platforms like Render/Heroku later
    /* ssl: { rejectUnauthorized: false } */
});

// ✅ Log successful connection
pool.on('connect', () => {
    console.log('✅ PostgreSQL Pool Connected');
});

// ✅ Critical: Handle errors on idle clients
pool.on('error', (err) => {
    console.error('❌ Unexpected database error on idle client', err);
    process.exit(-1);
});

export default pool;
