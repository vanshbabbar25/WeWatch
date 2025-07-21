import mongoose from "mongoose";

export async function connectToDB() {
    try {
            const conn = await mongoose.connect("mongodb+srv://vanshbabbar2507:XQmeLyui5BuA1xTE@wewatch.vjtpqum.mongodb.net/?retryWrites=true&w=majority&appName=WeWatch");
            console.log("MongoDB Connected: ", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1)
    }
}