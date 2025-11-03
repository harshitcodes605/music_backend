import mongoose from "mongoose";

const likedSongSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  track_id: {
    type: String,
    required: true,
  },
  track_name: String,
  artists: String,
  album_name: String,
  img: String,
  preview: String,
  likedAt: {
    type: Date,
    default: Date.now,
  },
});

const LikedSong = mongoose.model("LikedSong", likedSongSchema);
export default LikedSong;
