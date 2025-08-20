import express from "express";
import passport from "passport";
import { signup, login, logout, me, refresh } from"../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
const authRoute = express.Router();


/* NORMAL FLOW */
authRoute.post("/signup",signup);
authRoute.post("/login",login);
authRoute.post("/logout",logout);
authRoute.post('/refresh',refresh);



/* PROFILE */
authRoute.get("/me",protect,me);


export default authRoute;