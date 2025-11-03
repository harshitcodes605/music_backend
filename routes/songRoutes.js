import express from "express";
import {
  getPopularSongs,
  searchSongs,
  getSongsByAlbum,
  getRecommendations,
  getAllGenres,
  getSongsByGenre,
  addToRecentlyPlayed,
  getRecentlyPlayed,
  addToLikedSongs,
  getLikedSongs,
  removeLikedSong
} from "../controllers/songController.js";

import { verifyToken as protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/popular", getPopularSongs);
router.get("/search", searchSongs);
router.get("/album/:album_name", getSongsByAlbum);
router.get("/recommend/:track_id", getRecommendations);
router.get("/genres", getAllGenres);
router.get("/bygenre", getSongsByGenre);

router.post("/recent", protect, addToRecentlyPlayed);
router.get("/recent", protect, getRecentlyPlayed);

router.post("/liked", protect, addToLikedSongs);
router.get("/liked", protect, getLikedSongs);
router.delete("/liked/:track_id", protect, removeLikedSong);

export default router;
