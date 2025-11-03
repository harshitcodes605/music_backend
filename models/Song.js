import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    imageUrl: { type: String }, 
    audioUrl: { type: String }, 
    isTrending: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Song", songSchema);
