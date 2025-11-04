import RecentlyPlayed from "../models/RecentlyPlayed.js";

export const addRecentSong = async (req, res) => {
  try {
    const userId = req.user.id;
    const { songId, title, artist, album, coverImage, preview } = req.body;

    if (!songId || !title)
      return res.status(400).json({ message: "Song ID and title required" });

    await RecentlyPlayed.findOneAndDelete({ userId, track_id: songId });

    const newRecent = new RecentlyPlayed({
      userId,
      track_id: songId,
      track_name: title,
      artists: artist,
      album_name: album,
      img: coverImage,
      preview,
    });

    await newRecent.save();

    res.status(201).json({
      message: "Song added to recently played",
      song: newRecent,
    });
  } catch (error) {
    console.error("Add Recent Song Error:", error);
    res.status(500).json({ message: "Server error adding recent song" });
  }
};

export const getRecentSongs = async (req, res) => {
  try {
    const userId = req.user.id;
    const songs = await RecentlyPlayed.find({ userId })
      .sort({ playedAt: -1 })
      .limit(20);
    res.status(200).json(songs);
  } catch (error) {
    console.error("Get Recent Songs Error:", error);
    res.status(500).json({ message: "Server error fetching recent songs" });
  }
};
