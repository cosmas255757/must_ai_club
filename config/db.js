import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') 
        ? false 
        : { rejectUnauthorized: false }
});

pool.on('connect', () => {
    console.log('✅ PostgreSQL Pool Connected to Neon');
});

pool.on('error', (err) => {
    console.error('❌ Unexpected database error on idle client', err);
    if (process.env.NODE_ENV !== 'production') process.exit(-1);
});

export default pool;
