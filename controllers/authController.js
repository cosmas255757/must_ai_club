import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

// ✅ 1. REGISTER USER
export const register = async (req, res) => {
    try {
        const { username, email, phone_number, password, full_name } = req.body;

        // Validation: Ensure no missing fields for the schema
        if (!username || !email || !password || !full_name || !phone_number) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Create User (This handles user, profile, and default 'Student' role in one transaction)
        const newUser = await createUser({
            username,
            email,
            phone_number,
            password_hash,
            full_name,
            role_name: 'Student', // Default role for new signups
            is_superadmin: false   // Security: block superadmin elevation via registration
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error('Registration Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// ✅ 2. LOGIN USER
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Fetch user (Model includes joined roles and permissions)
        const user = await findUserByEmail(email);

        // 2. Validate Credentials
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Check Account Status (is_active from users table)
        if (!user.is_active) {
            return res.status(403).json({ message: 'Account deactivated' });
        }

        // 4. Generate JWT with RBAC Claims
        // Claims match exactly what the authorize middleware expects
        const token = jwt.sign(
            { 
                user_id: user.user_id, 
                is_superadmin: user.is_superadmin,
                roles: user.roles || [],
                permissions: user.permissions || [] 
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        // 5. Success Response
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                roles: user.roles,
                is_superadmin: user.is_superadmin
            }
        });

    } catch (error) {
        console.error('Login Error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
