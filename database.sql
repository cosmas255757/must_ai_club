-- 1. ROLES TABLE
-- Stores the names of roles created by the Superadmin (e.g., 'Student', 'AI Mentor')
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PERMISSIONS TABLE
-- Stores specific actions (e.g., 'upload_dataset', 'delete_user', 'edit_training')
CREATE TABLE permissions (
    permission_id SERIAL PRIMARY KEY,
    permission_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'TRAINING_CREATE'
    description TEXT
);

-- 3. USERS TABLE
-- Main account table. 'is_superadmin' bypasses all checks.
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone_number VARCHAR(25) NOT NULL,
    password_hash TEXT NOT NULL,
    is_superadmin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. ROLE_PERMISSIONS (Pivot Table)
-- This is where the Superadmin defines what a Role can actually do.
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(role_id) ON DELETE CASCADE,
    permission_id INTEGER REFERENCES permissions(permission_id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. USER_ROLES (Pivot Table)
-- Assigns one or more roles to a specific user.
CREATE TABLE user_roles (
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles(role_id) ON DELETE CASCADE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- 6. USER_PROFILES
-- Extended information for the AI Club (University details)
CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(100),
    student_id_number VARCHAR(20) UNIQUE, -- University ID
    department VARCHAR(100),
    github_url TEXT,
    bio TEXT,
    profile_pic_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- 2. Seed Critical Data (Required for code to run without errors)
INSERT INTO roles (role_name, description) 
VALUES ('Student', 'Default student access'), 
       ('AI Mentor', 'Can manage training and datasets')
ON CONFLICT (role_name) DO NOTHING;

INSERT INTO permissions (permission_key, description)
VALUES ('DATASET_UPLOAD', 'Ability to upload new datasets'),
       ('USER_MANAGE', 'Ability to view/edit other users')
ON CONFLICT (permission_key) DO NOTHING;
--======================================================================================================================
--======================================================================================================================
--======================================================================================================================
-- 7. TRAINING_MODULES
-- The "Curriculum" (e.g., Intro to CNNs, Natural Language Processing)
CREATE TABLE training_modules (
    module_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20), -- 'Beginner', 'Intermediate', 'Advanced'
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TRAINING_SESSIONS
-- Specific instances of a module (e.g., "Intro to CNNs" on Friday at Lab 4)
CREATE TABLE training_sessions (
    session_id SERIAL PRIMARY KEY,
    module_id INTEGER REFERENCES training_modules(module_id) ON DELETE CASCADE,
    trainer_id INTEGER REFERENCES users(user_id), -- The AI Trainer
    scheduled_at TIMESTAMP NOT NULL,
    location VARCHAR(100), -- 'Room 302' or 'Zoom Link'
    max_capacity INTEGER DEFAULT 30,
    status VARCHAR(20) DEFAULT 'Scheduled' -- 'Scheduled', 'Completed', 'Cancelled'
);

-- 9. ENROLLMENTS
-- Tracks which students are registered for which specific training sessions
CREATE TABLE enrollments (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    session_id INTEGER REFERENCES training_sessions(session_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completion_status BOOLEAN DEFAULT FALSE,
    UNIQUE(student_id, session_id) -- Prevents double enrollment
);

-- 10. ATTENDANCE_LOGS
-- Daily tracking to see if the student actually showed up
CREATE TABLE attendance_logs (
    attendance_id SERIAL PRIMARY KEY,
    enrollment_id INTEGER REFERENCES enrollments(enrollment_id) ON DELETE CASCADE,
    check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_present BOOLEAN DEFAULT TRUE
);

-- 11. AI_PROJECTS
-- Projects developed by club members (e.g., 'Face Recognition App')
CREATE TABLE ai_projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    repository_url TEXT, -- Link to GitHub
    status VARCHAR(20) DEFAULT 'In Progress', -- 'In Progress', 'Finished'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. PROJECT_CONTRIBUTORS (Pivot Table)
-- Links multiple users to one project (Team collaboration)
CREATE TABLE project_contributors (
    project_id INTEGER REFERENCES ai_projects(project_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    contribution_role VARCHAR(50), -- 'Lead Developer', 'Data Scientist'
    PRIMARY KEY (project_id, user_id)
);

-- 13. DATASETS_LIBRARY
-- Shared datasets for AI training (e.g., 'MNIST', 'Custom University Dataset')
CREATE TABLE datasets_library (
    dataset_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    download_url TEXT,
    size_mb DECIMAL,
    uploaded_by INTEGER REFERENCES users(user_id)
);

-- 14. COMPUTE_RESOURCES
-- Tracking GPU/Server usage (Who is using the Club's RTX 3090?)
CREATE TABLE compute_resources (
    resource_id SERIAL PRIMARY KEY,
    resource_name VARCHAR(100), -- 'Server A', 'NVIDIA Jetson'
    current_user_id INTEGER REFERENCES users(user_id),
    status VARCHAR(20) DEFAULT 'Available', -- 'Available', 'In Use', 'Maintenance'
    last_reserved_at TIMESTAMP
);

-- 15. CERTIFICATIONS
-- Issued when a student completes a full Training Module
CREATE TABLE certifications (
    cert_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    module_id INTEGER REFERENCES training_modules(module_id),
    issue_date DATE DEFAULT CURRENT_DATE,
    certificate_code VARCHAR(50) UNIQUE -- For verification
);

-- 16. MENTORSHIP_PAIRINGS
-- Links senior students or admins to junior students for AI guidance
CREATE TABLE mentorship_pairings (
    mentor_id INTEGER REFERENCES users(user_id),
    mentee_id INTEGER REFERENCES users(user_id),
    paired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (mentor_id <> mentee_id), -- Can't mentor yourself
    PRIMARY KEY (mentor_id, mentee_id)
);

--======================================================================================================================
--=======================================================================================================================
--=======================================================================================================================

-- 17. ANNOUNCEMENTS
-- Official broadcasts from Superadmin or Trainers
CREATE TABLE announcements (
    announcement_id SERIAL PRIMARY KEY,
    author_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'Normal', -- 'Low', 'Normal', 'Urgent'
    target_role_id INTEGER REFERENCES roles(role_id), -- NULL means 'Everyone'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. EVENTS_CALENDAR
-- Non-training events like Hackathons, AI Guest Lectures, or Socials
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(150) NOT NULL,
    description TEXT,
    event_type VARCHAR(50), -- 'Hackathon', 'Webinar', 'Meetup'
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    location VARCHAR(200),
    is_public BOOLEAN DEFAULT TRUE
);

-- 19. EVENT_REGISTRATIONS
-- RSVPs for the events listed above
CREATE TABLE event_registrations (
    registration_id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    attended BOOLEAN DEFAULT FALSE
);

-- 20. FINANCES_INCOME
-- Tracks membership fees, sponsorships, or university grants
CREATE TABLE finances_income (
    income_id SERIAL PRIMARY KEY,
    source_name VARCHAR(100) NOT NULL, -- 'Membership Fee', 'NVIDIA Grant'
    amount DECIMAL(12, 2) NOT NULL,
    received_date DATE DEFAULT CURRENT_DATE,
    recorded_by INTEGER REFERENCES users(user_id),
    receipt_url TEXT
);

-- 21. FINANCES_EXPENSES
-- Tracks club spending (Snacks, Cloud Credits, Hardware)
CREATE TABLE finances_expenses (
    expense_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    expense_date DATE DEFAULT CURRENT_DATE,
    category VARCHAR(50), -- 'Equipment', 'Catering', 'Software'
    approved_by INTEGER REFERENCES users(user_id)
);

-- 22. INVENTORY
-- Physical hardware tracking (Jetson Nanos, GPUs, Arduino kits)
CREATE TABLE inventory (
    item_id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    serial_number VARCHAR(100) UNIQUE,
    condition VARCHAR(50) DEFAULT 'Good', -- 'New', 'Good', 'Damaged'
    purchase_date DATE,
    assigned_to_user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL
);

-- 23. FEEDBACK_SURVEYS
-- Student reviews after training sessions to improve the club
CREATE TABLE feedback (
    feedback_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    session_id INTEGER REFERENCES training_sessions(session_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 24. LIBRARY_BOOKS
-- Physical or digital AI/ML textbooks borrowed by members
CREATE TABLE library_assets (
    asset_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(100),
    format VARCHAR(10) DEFAULT 'Physical', -- 'Physical', 'PDF', 'E-Book'
    current_holder_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    due_date DATE
);

-- 25. SYSTEM_LOGS (Audit Trail)
-- Tracks exactly what Superadmins or Trainers changed (Security)
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL, -- 'CREATED_ROLE', 'DELETED_USER'
    table_affected VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
--===========================================================================================================
INSERT INTO role_permissions (role_id, permission_id)
VALUES (
    (SELECT role_id FROM roles WHERE role_name = 'Admin'),
    (SELECT permission_id FROM permissions WHERE permission_key = 'ADMIN_ACCESS')
);



INSERT INTO permissions (permission_key) VALUES
('ROLE_CREATE'),
('ROLE_ASSIGN'),
('PERMISSION_ASSIGN');


-- safer version
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'Admin'
AND p.permission_key IN ('ROLE_CREATE','ROLE_ASSIGN','PERMISSION_ASSIGN');


INSERT INTO permissions (permission_key) VALUES
('USER_CREATE'),
('USER_VIEW'),
('USER_UPDATE');


INSERT INTO role_permissions (role_id, permission_id)
SELECT r.role_id, p.permission_id
FROM roles r, permissions p
WHERE r.role_name = 'Admin'
AND p.permission_key IN ('USER_CREATE','USER_VIEW','USER_UPDATE');
