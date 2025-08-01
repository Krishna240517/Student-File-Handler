import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import groupRoute from "./routes/group.route.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));
app.use("/api/v1/auth",authRoute);
app.use("/api/v1/group",groupRoute);


const startServer = async() => {
    try {
        await connectDB();
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database");
        process.exit(1);
    }
};
startServer();