import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to the database");
    } catch(error) {
        console.error("Error connecting to the database");
        process.exit(1);
    }
}