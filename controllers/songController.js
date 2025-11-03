import fetch from "node-fetch";

const ML_API_BASE = "https://music-recommendation-system-71od.onrender.com"; 

export const getPopularSongs = async (req, res) => {
  try {
    const response = await fetch(`${ML_API_BASE}/popular`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching popular songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const searchSongs = async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ message: "Query is required" });

  try {
    const response = await fetch(`${ML_API_BASE}/search?query=${query}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error searching songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getSongsByAlbum = async (req, res) => {
  const { album_name } = req.params;
  try {
    const response = await fetch(`${ML_API_BASE}/album/${album_name}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching album songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getRecommendations = async (req, res) => {
  const { track_id } = req.params;
  if (!track_id) return res.status(400).json({ message: "track_id is required" });

  try {
    const response = await fetch(`${ML_API_BASE}/recommend/${track_id}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllGenres = async (req, res) => {
  try {
    const response = await fetch(`${ML_API_BASE}/genres`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getSongsByGenre = async (req, res) => {
  const { genre, limit = 50, shuffle = false } = req.query;
  if (!genre) return res.status(400).json({ message: "Genre is required" });

  try {
    const response = await fetch(`${ML_API_BASE}/songs_by_genre?genre=${genre}&limit=${limit}&shuffle=${shuffle}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching songs by genre:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



import RecentlyPlayed from "../models/RecentlyPlayed.js";

export const addToRecentlyPlayed = async (req, res) => {
  try {
    const { track_id, track_name, artists, album_name, img, preview } = req.body;
    const userId = req.user.id; 

    let existing = await RecentlyPlayed.findOne({ userId, track_id });

    if (existing) {
      existing.playedAt = new Date(); 
      await existing.save();
    } else {
      await RecentlyPlayed.create({
        userId,
        track_id,
        track_name,
        artists,
        album_name,
        img,
        preview,
      });
    }

    const songsToDelete = await RecentlyPlayed.find({ userId })
      .sort({ playedAt: -1 })
      .skip(10);

    if (songsToDelete.length > 0) {
      const oldIds = songsToDelete.map((s) => s._id);
      await RecentlyPlayed.deleteMany({ _id: { $in: oldIds } });
    }

    const updatedList = await RecentlyPlayed.find({ userId })
      .sort({ playedAt: -1 })
      .limit(10);

    res.status(201).json({
      message: "Song added to recently played",
      recentlyPlayed: updatedList,
    });
  } catch (error) {
    console.error("Error adding recently played:", error);
    res.status(500).json({ message: "Error adding to recently played" });
  }
};


export const getRecentlyPlayed = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await RecentlyPlayed.find({ userId })
      .sort({ playedAt: -1 })
      .limit(10);
    res.status(200).json(songs);
  } catch (error) {
    console.error("Error fetching recently played:", error);
    res.status(500).json({ message: "Error fetching recently played" });
  }
};

import LikedSong from "../models/LikedSong.js";

export const addToLikedSongs = async (req, res) => {
  try {
    const { track_id, track_name, artists, album_name, img, preview } = req.body;
    const userId = req.user.id;

    const existing = await LikedSong.findOne({ userId, track_id });
    if (existing) {
      return res.status(400).json({ message: "Song already liked" });
    }

    await LikedSong.create({
      userId,
      track_id,
      track_name,
      artists,
      album_name,
      img,
      preview,
    });

    res.status(201).json({ message: "Song added to liked songs" });
  } catch (error) {
    console.error("Error adding to liked songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await LikedSong.find({ userId }).sort({ likedAt: -1 });
    res.status(200).json({ likedSongs: songs });
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeLikedSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { track_id } = req.params;

    await LikedSong.findOneAndDelete({ userId, track_id });

    res.status(200).json({ message: "Song removed from liked songs" });
  } catch (error) {
    console.error("Error removing liked song:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

