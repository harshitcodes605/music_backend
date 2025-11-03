import LikedSong from "../models/LikedSong.js";
import User from "../models/User.js";

export const addLikedSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, title, artist, album, duration, coverImage } = req.body;

    if (!songId || !title)
      return res.status(400).json({ message: "Song ID and title required" });

    const newLike = new LikedSong({
      user: userId,
      songId,
      title,
      artist,
      album,
      duration,
      coverImage,
    });

    await newLike.save();
    res.status(201).json({ message: "Song added to liked list", song: newLike });
  } catch (error) {
    console.error("Add Liked Song Error:", error);
    res.status(500).json({ message: "Server error adding liked song" });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await LikedSong.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(songs);
  } catch (error) {
    console.error("Get Liked Songs Error:", error);
    res.status(500).json({ message: "Server error fetching liked songs" });
  }
};

export const removeLikedSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId } = req.params;

    await LikedSong.findOneAndDelete({ user: userId, songId });
    res.status(200).json({ message: "Song removed from liked list" });
  } catch (error) {
    console.error("Remove Liked Song Error:", error);
    res.status(500).json({ message: "Server error removing liked song" });
  }
};
