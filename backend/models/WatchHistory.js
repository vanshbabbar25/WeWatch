import mongoose from "mongoose";

const watchedMovieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    genre_ids: { type: [Number], default: [] },
    overview: { type: String, default: "" },
    vote_average: { type: Number, default: 0 },
    poster_path: { type: String, default: "" },
    release_date: { type: String, default: "" },
    watchedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const watchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    movies: {
      type: [watchedMovieSchema],
      default: [],
    },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

watchHistorySchema.methods.sorted = function () {
  return [...this.movies].sort(
    (a, b) => new Date(b.watchedAt) - new Date(a.watchedAt)
  );
};

export default mongoose.model("WatchHistory", watchHistorySchema);