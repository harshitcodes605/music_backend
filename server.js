import dotenv from "dotenv";
dotenv.config();
console.log("Testing ENV:");
console.log("Email user:", process.env.EMAIL_USER);
console.log("Email pass:", process.env.EMAIL_PASS ? "Loaded" : "Missing");

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import songRoutes from "./routes/songRoutes.js";
const app = express();

app.use(express.json());
app.use(cors(
    {
        origin:"*",
        credentials:true
    }
));


connectDB();

app.use("/api/auth", authRoutes);

app.use("/api/songs", songRoutes);
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
