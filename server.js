import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors"; // Added
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectReviewRoutes from "./routes/projectReviewRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js"; // Added

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors()); // Added: Essential for cross-origin requests
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Added: Good for form-data
app.use(express.static(path.join(__dirname, "frontend")));

// --- API Routes ---
app.use("/api/auth", authRoutes); // This handles Login, Register, & Admin User CRUD
app.use("/api/projects", projectRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reviews", projectReviewRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);
app.use("/api/enrollments", enrollmentRoutes); // Added

// --- Static HTML Routes ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "frontend", "index.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "frontend", "about.html")));
app.get("/auth", (req, res) => res.sendFile(path.join(__dirname, "frontend", "auth.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "frontend", "contact.html")));


app.get("/:role/*", (req, res, next) => {
  const roles = ["admin", "student", "facilitator", "sponsor"];
  if (roles.includes(req.params.role)) {
    return res.sendFile(path.join(__dirname, "frontend", req.params.role, "dashboard.html"));
  }
  next();
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
