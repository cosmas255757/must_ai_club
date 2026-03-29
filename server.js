import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all static files (CSS, JS, Images, and HTML) from the frontend folder
app.use(express.static(path.join(__dirname, "frontend")));

// --- API Routes ---
app.use("/api/auth", authRoutes); 

// --- Static HTML Routes (Public Pages) ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "frontend", "index.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "frontend", "about.html")));
app.get("/auth", (req, res) => res.sendFile(path.join(__dirname, "frontend", "auth.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "frontend", "contact.html")));

// --- Role-Based Dashboard Redirects ---
app.get("/:role/dashboard.html", (req, res, next) => {
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
app.listen(PORT, () => console.log(`🚀 Auth Server running on port ${PORT}`));
