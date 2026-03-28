import pool from "../config/db.js";

// -------------------------
// STUDENT PROJECTS
// -------------------------

export const submitProject = async (studentId, title, description, fileUrl) => {
  const query = `
    INSERT INTO projects (student_id, title, description, file_url)
    VALUES ($1, $2, $3, $4)
    RETURNING id, student_id, title, description, file_url, submitted_at
  `;
  const values = [studentId, title, description, fileUrl];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getProjectById = async (projectId) => {
  const query = `
    SELECT p.id, p.student_id, p.title, p.description, p.file_url, p.submitted_at, u.name AS student_name, u.email AS student_email
    FROM projects p
    JOIN users u ON p.student_id = u.id
    WHERE p.id = $1
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};

export const listAllProjects = async () => {
  const query = `
    SELECT p.id, p.student_id, p.title, p.description, p.file_url, p.submitted_at, u.name AS student_name, u.email AS student_email
    FROM projects p
    JOIN users u ON p.student_id = u.id
    ORDER BY p.submitted_at DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const listProjectsByStudent = async (studentId) => {
  const query = `
    SELECT id, title, description, file_url, submitted_at
    FROM projects
    WHERE student_id = $1
    ORDER BY submitted_at DESC
  `;
  const result = await pool.query(query, [studentId]);
  return result.rows;
};

export const updateProject = async (projectId, title, description, fileUrl) => {
  const query = `
    UPDATE projects
    SET title = $2,
        description = $3,
        file_url = $4
    WHERE id = $1
    RETURNING id, student_id, title, description, file_url, submitted_at
  `;
  const values = [projectId, title, description, fileUrl];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteProject = async (projectId) => {
  const query = `
    DELETE FROM projects
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows[0];
};
