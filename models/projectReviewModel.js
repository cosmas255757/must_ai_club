import pool from "../config/db.js";

// -------------------------
// PROJECT REVIEWS
// -------------------------

export const addReview = async (projectId, facilitatorId, status, comments) => {
  const query = `
    INSERT INTO project_reviews (project_id, facilitator_id, status, comments)
    VALUES ($1, $2, $3, $4)
    RETURNING id, project_id, facilitator_id, status, comments, reviewed_at
  `;
  const values = [projectId, facilitatorId, status, comments];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getReviewById = async (reviewId) => {
  const query = `
    SELECT pr.id, pr.project_id, pr.facilitator_id, pr.status, pr.comments, pr.reviewed_at,
           u.name AS facilitator_name, u.email AS facilitator_email,
           p.title AS project_title
    FROM project_reviews pr
    JOIN users u ON pr.facilitator_id = u.id
    JOIN projects p ON pr.project_id = p.id
    WHERE pr.id = $1
  `;
  const result = await pool.query(query, [reviewId]);
  return result.rows[0];
};

export const listReviewsByProject = async (projectId) => {
  const query = `
    SELECT pr.id, pr.facilitator_id, pr.status, pr.comments, pr.reviewed_at,
           u.name AS facilitator_name, u.email AS facilitator_email
    FROM project_reviews pr
    JOIN users u ON pr.facilitator_id = u.id
    WHERE pr.project_id = $1
    ORDER BY pr.reviewed_at DESC
  `;
  const result = await pool.query(query, [projectId]);
  return result.rows;
};

export const listReviewsByFacilitator = async (facilitatorId) => {
  const query = `
    SELECT pr.id, pr.project_id, pr.status, pr.comments, pr.reviewed_at,
           p.title AS project_title, u.name AS student_name, u.email AS student_email
    FROM project_reviews pr
    JOIN projects p ON pr.project_id = p.id
    JOIN users u ON p.student_id = u.id
    WHERE pr.facilitator_id = $1
    ORDER BY pr.reviewed_at DESC
  `;
  const result = await pool.query(query, [facilitatorId]);
  return result.rows;
};

export const updateReview = async (reviewId, status, comments) => {
  const query = `
    UPDATE project_reviews
    SET status = $2,
        comments = $3
    WHERE id = $1
    RETURNING id, project_id, facilitator_id, status, comments, reviewed_at
  `;
  const result = await pool.query(query, [reviewId, status, comments]);
  return result.rows[0];
};

export const deleteReview = async (reviewId) => {
  const query = `
    DELETE FROM project_reviews
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [reviewId]);
  return result.rows[0];
};
