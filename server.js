import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectReviewRoutes from "./routes/projectReviewRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(express.static(path.join(__dirname, "frontend")));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reviews", projectReviewRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "about.html"));
});

app.get("/auth", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "auth.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "contact.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
