import LikedSong from "../models/LikedSong.js";

export const addLikedSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, title, artist, album, coverImage, preview } = req.body;

    if (!songId || !title)
      return res.status(400).json({ message: "Song ID and title required" });

    const existing = await LikedSong.findOne({ userId, track_id: songId });
    if (existing)
      return res.status(400).json({ message: "Song already in liked list" });

    const newLiked = new LikedSong({
      userId,
      track_id: songId,
      track_name: title,
      artists: artist,
      album_name: album,
      img: coverImage,
      preview,
    });

    await newLiked.save();
    res.status(201).json({
      message: "Song added to liked list",
      song: newLiked,
    });
  } catch (error) {
    console.error("Add Liked Song Error:", error);
    res.status(500).json({ message: "Server error adding liked song" });
  }
};

export const getLikedSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await LikedSong.find({ userId })
      .sort({ likedAt: -1 })
      .limit(50);
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

    const deleted = await LikedSong.findOneAndDelete({ userId, track_id: songId });
    if (!deleted)
      return res.status(404).json({ message: "Song not found in liked list" });

    res.status(200).json({ message: "Song removed from liked list" });
  } catch (error) {
    console.error("Remove Liked Song Error:", error);
    res.status(500).json({ message: "Server error removing liked song" });
  }
};
