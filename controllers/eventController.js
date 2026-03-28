import {
  createEvent,
  getEventById,
  listAllEvents,
  updateEvent,
  deleteEvent,
  addParticipant,
  getParticipantsByEvent,
  getEventsByUser,
  removeParticipant,
} from "../models/eventModel.js";

// -------------------------
// CREATE EVENT
// -------------------------
export const addEvent = async (req, res) => {
  try {
    const { title, description, eventDate } = req.body;
    const user = req.user;

    if (!title || !description || !eventDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (user.role !== "facilitator" && user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const event = await createEvent(title, description, eventDate, user.id);

    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// GET SINGLE EVENT
// -------------------------
export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await getEventById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LIST EVENTS
// -------------------------
export const listEvents = async (req, res) => {
  try {
    const events = await listAllEvents();
    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// UPDATE EVENT
// -------------------------
export const editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, eventDate } = req.body;
    const user = req.user;

    if (!title || !description || !eventDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEvent = await getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      user.role !== "admin" &&
      existingEvent.created_by !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const event = await updateEvent(id, title, description, eventDate);

    res.json({ message: "Event updated", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// DELETE EVENT
// -------------------------
export const removeEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const existingEvent = await getEventById(id);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (
      user.role !== "admin" &&
      existingEvent.created_by !== user.id
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const event = await deleteEvent(id);

    res.json({ message: "Event deleted", event });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// JOIN EVENT (Student)
// -------------------------
export const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const user = req.user;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID required" });
    }

    const event = await getEventById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const participant = await addParticipant(user.id, eventId);

    res.status(201).json({ message: "Joined event", participant });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// LEAVE EVENT
// -------------------------
export const leaveEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const user = req.user;

    const result = await removeParticipant(user.id, eventId);

    res.json({ message: "Left event", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// VIEW PARTICIPANTS
// -------------------------
export const getParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    const participants = await getParticipantsByEvent(eventId);

    res.json({ participants });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------------
// EVENTS OF LOGGED USER
// -------------------------
export const myEvents = async (req, res) => {
  try {
    const user = req.user;

    const events = await getEventsByUser(user.id);

    res.json({ events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
