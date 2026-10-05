import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.route.js";
import oauthRoutes from "./routes/oauth.route.js";
import userRoute from "./routes/user.route.js";
import groupRoute from "./routes/group.route.js";
import fileRoute from "./routes/file.route.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    credentials:true,
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    }
}))
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

/* NORMAL AUTH 👇*/
app.use("/api-auth",authRoutes);
/* OAUTH 👇*/
app.use("/auth",oauthRoutes);
/*USER 👇*/
app.use("/user",userRoute);
/*GROUP👇*/
app.use("/user-group",groupRoute);
/*FILE 👇*/
app.use("/user-file", fileRoute);

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is missing");
    }
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the database");
};

const startServer = async () => {
    try {
        await connectDB();
        if (!process.env.VERCEL) {
            const port = process.env.PORT || 3000;
            app.listen(port,()=>{
                console.log("SERVER IS RUNNING ON PORT",port);
            });
        }
    } catch(error) {
        console.error(error);
        console.error("Error in starting the server");
        if (!process.env.VERCEL) {
            process.exit(1);
        }
    }
}
startServer();

export default app;
