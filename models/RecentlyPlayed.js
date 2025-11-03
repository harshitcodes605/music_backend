import mongoose from "mongoose";

const recentlyPlayedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  track_id: { type: String, required: true },
  track_name: String,
  artists: String,
  album_name: String,
  img: String,
  preview: String,
  playedAt: { type: Date, default: Date.now },
});

recentlyPlayedSchema.index({ userId: 1, track_id: 1 }, { unique: true });

export default mongoose.model("RecentlyPlayed", recentlyPlayedSchema);
