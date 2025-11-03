import express from "express";
import { addLikedSong, getLikedSongs, removeLikedSong } from "../controllers/likedController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", verifyToken, addLikedSong);
router.get("/", verifyToken, getLikedSongs);
router.delete("/:songId", verifyToken, removeLikedSong);

export default router;
