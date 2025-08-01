import express from "express";
import { login, signup,logout, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { signupSchema, loginSchema } from "../inputValidation/schema.js";
import { validate } from "../inputValidation/validator.js";
const authRoute = express.Router();


authRoute.post("/signup",validate(signupSchema),signup);
authRoute.post("/login",validate(loginSchema),login);
authRoute.post("/logout",protectRoute, logout);
authRoute.get("/profile",protectRoute,getProfile);
authRoute.put("/updateProfile",protectRoute, updateProfile);

export default authRoute;