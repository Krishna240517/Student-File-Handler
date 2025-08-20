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


app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
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

const startServer = () => {
    try {
        mongoose.connect(process.env.MONGO_URI).then(()=>{
            console.log("Connected to the database");
            const port = process.env.PORT;
            app.listen(port,()=>{
                console.log("SERVER IS RUNNING ON PORT",port);
            })
        }).catch(()=>{
            console.error("Error connecting to the database");
            process.exit(1);
        })
    } catch(error) {
        console.error("Error in starting the server");
            process.exit(1);
    }
}
startServer();