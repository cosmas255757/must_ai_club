import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Serve all static assets (CSS, JS, Images) from the frontend folder
app.use(express.static(path.join(__dirname, "frontend"), {
    extensions: ['html']
}));

// --- API Routes ---
app.use("/api/auth", authRoutes); 
app.use("/api/admin", authRoutes); 


// --- Public Page Routes ---
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "frontend", "index.html")));
app.get("/about", (req, res) => res.sendFile(path.join(__dirname, "frontend", "about.html")));
app.get("/auth", (req, res) => res.sendFile(path.join(__dirname, "frontend", "auth.html")));
app.get("/contact", (req, res) => res.sendFile(path.join(__dirname, "frontend", "contact.html")));

app.get("/:role/:page", (req, res, next) => {
    const roles = ["admin", "student", "facilitator", "sponsor"];
    const { role, page } = req.params;

    if (roles.includes(role)) {
        // Build the path to the specific HTML file in that role's folder
        const fileName = page.endsWith('.html') ? page : `${page}.html`;
        const filePath = path.join(__dirname, "frontend", role, fileName);
        
        return res.sendFile(filePath, (err) => {
            if (err) {
                return res.sendFile(path.join(__dirname, "frontend", role, "dashboard.html"));
            }
        });
    }
    next();
});

app.get("/:role", (req, res, next) => {
    const roles = ["admin", "student", "facilitator", "sponsor"];
    if (roles.includes(req.params.role)) {
        return res.sendFile(path.join(__dirname, "frontend", req.params.role, "dashboard.html"));
    }
    next();
});

app.use((err, req, res, next) => {
    console.error("Server Error:", err.stack);
    res.status(500).json({ message: "An internal server error occurred." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 MUST AI HUB Server running on port ${PORT}`);
});

// server.keepAliveTimeout = 120000; // 120 seconds
// server.headersTimeout = 120500; 