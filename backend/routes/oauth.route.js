import passport from "passport";
import express from "express";
import jwt from "jsonwebtoken";
const oauthRoutes = express.Router();


oauthRoutes.get("/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

oauthRoutes.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/signup" }),
    (req, res) => {
        const accessToken = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jwt.sign({ id: req.user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        req.user.refreshToken = refreshToken;
        req.user.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });


         res.redirect("http://localhost:5173/profile");
    }
);

export default oauthRoutes;