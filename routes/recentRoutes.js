import express from "express";
import { addRecentSong, getRecentSongs } from "../controllers/recentController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/add", verifyToken, addRecentSong);
router.get("/", verifyToken, getRecentSongs);

export default router;
