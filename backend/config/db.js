import mongoose from "mongoose";

export async function connectToDB() {
    try {
            const conn = await mongoose.connect(process.env.MONGO_URL);
            console.log("MongoDB Connected: ", conn.connection.host);
    } catch (error) {
        console.log("Error connecting to MongoDB: ", error.message);
        process.exit(1)
    }
}