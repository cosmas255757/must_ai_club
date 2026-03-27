import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ 1. VERIFY TOKEN (Authentication)
// This is the gatekeeper for all protected routes.
export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach the full RBAC payload to the request object
        // Payload includes: user_id, is_superadmin, roles[], permissions[]
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// ✅ 2. REQUIRE PERMISSION (Granular Authorization)
// Matches specific permission_key from your 'permissions' table
export const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        const { is_superadmin, permissions } = req.user;

        // Superadmin bypasses all permission checks
        if (is_superadmin) return next();

        if (!permissions || !permissions.includes(requiredPermission)) {
            return res.status(403).json({ 
                message: `Forbidden: Missing required permission [${requiredPermission}]` 
            });
        }
        next();
    };
};

// ✅ 3. REQUIRE ROLE (Broad Authorization)
// Matches role_name from your 'roles' table (e.g., 'Student', 'AI Mentor')
export const requireRole = (requiredRole) => {
    return (req, res, next) => {
        const { is_superadmin, roles } = req.user;

        if (is_superadmin) return next();

        if (!roles || !roles.includes(requiredRole)) {
            return res.status(403).json({ 
                message: `Forbidden: This action requires the [${requiredRole}] role.` 
            });
        }
        next();
    };
};

// ✅ 4. SUPERADMIN ONLY (System-wide Authorization)
// For critical tasks like deleting roles or granting superadmin status
export const superAdminOnly = (req, res, next) => {
    if (!req.user || !req.user.is_superadmin) {
        return res.status(403).json({ message: 'Access restricted to Superadmins only.' });
    }
    next();
};
