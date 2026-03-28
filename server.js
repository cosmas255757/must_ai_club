import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import projectReviewRoutes from "./routes/projectReviewRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import sponsorshipRoutes from "./routes/sponsorshipRoutes.js";



dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/reviews", projectReviewRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
