import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import likedRoutes from "./routes/likedRoutes.js";
import recentRoutes from "./routes/recentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(
  cors({
    origin: [
      "https://music-system-pgz2.vercel.app", 
      "http://localhost:3000" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
  })
);

app.options(/.*/, cors());

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/liked", likedRoutes);
app.use("/api/recent", recentRoutes);

app.get("/", (req, res) => res.send("Music Backend is running 🎵"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
