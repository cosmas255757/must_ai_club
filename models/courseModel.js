import pool from "../config/db.js";

// -------------------------
// COURSES
// -------------------------

export const createCourse = async (title, description, facilitatorId) => {
  const query = `
    INSERT INTO courses (title, description, created_by)
    VALUES ($1, $2, $3)
    RETURNING id, title, description, created_by, created_at
  `;
  const values = [title, description, facilitatorId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getCourseById = async (courseId) => {
  const query = `
    SELECT id, title, description, created_by, created_at
    FROM courses
    WHERE id = $1
  `;
  const result = await pool.query(query, [courseId]);
  return result.rows[0];
};

export const listAllCourses = async () => {
  const query = `
    SELECT id, title, description, created_by, created_at
    FROM courses
    ORDER BY created_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateCourse = async (courseId, title, description) => {
  const query = `
    UPDATE courses
    SET title = $2,
        description = $3
    WHERE id = $1
    RETURNING id, title, description, created_by, created_at
  `;
  const values = [courseId, title, description];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteCourse = async (courseId) => {
  const query = `
    DELETE FROM courses
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [courseId]);
  return result.rows[0];
};

// -------------------------
// ENROLLMENTS
// -------------------------

export const enrollStudent = async (userId, courseId) => {
  const query = `
    INSERT INTO enrollments (user_id, course_id)
    VALUES ($1, $2)
    RETURNING id, user_id, course_id, status
  `;
  const result = await pool.query(query, [userId, courseId]);
  return result.rows[0];
};

export const getEnrollmentsByUser = async (userId) => {
  const query = `
    SELECT e.id, e.course_id, e.status, c.title, c.description
    FROM enrollments e
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getStudentsByCourse = async (courseId) => {
  const query = `
    SELECT e.id, e.user_id, e.status, u.name, u.email
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    WHERE e.course_id = $1
  `;
  const result = await pool.query(query, [courseId]);
  return result.rows;
};

export const updateEnrollmentStatus = async (enrollmentId, status) => {
  const query = `
    UPDATE enrollments
    SET status = $2
    WHERE id = $1
    RETURNING id, user_id, course_id, status
  `;
  const result = await pool.query(query, [enrollmentId, status]);
  return result.rows[0];
};
