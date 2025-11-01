import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    imageUrl: { type: String }, // cover image URL
    audioUrl: { type: String }, // song file URL (not for playback, just metadata)
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
