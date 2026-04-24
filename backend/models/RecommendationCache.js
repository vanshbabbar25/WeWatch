import mongoose from "mongoose";

const recommendedMovieSchema = new mongoose.Schema(
  {
    tmdbId: { type: Number, required: true },
    title: { type: String, required: true },
    genre_ids: { type: [Number], default: [] },
    overview: { type: String, default: "" },
    vote_average: { type: Number, default: 0 },
    poster_path: { type: String, default: "" },
    release_date: { type: String, default: "" },
    score: { type: Number, required: true },
    scoreBreakdown: {
      genreScore: Number,
      descSimilarity: Number,
      ratingScore: Number,
    },
  },
  { _id: false }
);

const recommendationCacheSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Snapshot of which movies generated these recommendations.
    // If it changes, the cache is invalidated and rebuilt.
    basedOnMovieIds: { type: [Number], default: [] },

    recommendations: { type: [recommendedMovieSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
  }
);
recommendationCacheSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

export default mongoose.model("RecommendationCache", recommendationCacheSchema);