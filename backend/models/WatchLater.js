import mongoose from "mongoose";

const watchLaterSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        movieId: {
            type: String, // TMDB id
            required: true,
        },
        title: String,
        poster: String,
    },
    { timestamps: true }
);

// Prevent duplicates
watchLaterSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("WatchLater", watchLaterSchema);