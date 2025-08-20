import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { updateProfile } from "../controllers/user.controller.js";
const userRoute = express.Router();

userRoute.put("/edit-profile",protect, updateProfile);

export default userRoute;