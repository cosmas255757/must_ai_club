import pool from "../config/db.js";

// -------------------------
// EVENTS
// -------------------------

export const createEvent = async (title, description, eventDate, creatorId) => {
  const query = `
    INSERT INTO events (title, description, event_date, created_by)
    VALUES ($1, $2, $3, $4)
    RETURNING id, title, description, event_date, created_by, created_at
  `;
  const values = [title, description, eventDate, creatorId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getEventById = async (eventId) => {
  const query = `
    SELECT id, title, description, event_date, created_by, created_at
    FROM events
    WHERE id = $1
  `;
  const result = await pool.query(query, [eventId]);
  return result.rows[0];
};

export const listAllEvents = async () => {
  const query = `
    SELECT id, title, description, event_date, created_by, created_at
    FROM events
    ORDER BY event_date DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const updateEvent = async (eventId, title, description, eventDate) => {
  const query = `
    UPDATE events
    SET title = $2,
        description = $3,
        event_date = $4
    WHERE id = $1
    RETURNING id, title, description, event_date, created_by, created_at
  `;
  const values = [eventId, title, description, eventDate];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const deleteEvent = async (eventId) => {
  const query = `
    DELETE FROM events
    WHERE id = $1
    RETURNING id
  `;
  const result = await pool.query(query, [eventId]);
  return result.rows[0];
};

// -------------------------
// EVENT PARTICIPANTS
// -------------------------

export const addParticipant = async (userId, eventId) => {
  const query = `
    INSERT INTO event_participants (user_id, event_id)
    VALUES ($1, $2)
    RETURNING id, user_id, event_id
  `;
  const result = await pool.query(query, [userId, eventId]);
  return result.rows[0];
};

export const getParticipantsByEvent = async (eventId) => {
  const query = `
    SELECT ep.id, ep.user_id, u.name, u.email
    FROM event_participants ep
    JOIN users u ON ep.user_id = u.id
    WHERE ep.event_id = $1
  `;
  const result = await pool.query(query, [eventId]);
  return result.rows;
};

export const getEventsByUser = async (userId) => {
  const query = `
    SELECT ep.id, e.id AS event_id, e.title, e.description, e.event_date
    FROM event_participants ep
    JOIN events e ON ep.event_id = e.id
    WHERE ep.user_id = $1
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const removeParticipant = async (userId, eventId) => {
  const query = `
    DELETE FROM event_participants
    WHERE user_id = $1 AND event_id = $2
    RETURNING id
  `;
  const result = await pool.query(query, [userId, eventId]);
  return result.rows[0];
};
