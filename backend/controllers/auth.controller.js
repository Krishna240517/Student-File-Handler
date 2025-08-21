import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {

        const existing = await User.findOne({ email });
        if (existing) {
            if (existing.provider === "google") {
                return res.status(400).json({
                    message: "This email is already registered with Google. Please use Google login.",
                });
            }
            return res.status(400).json({ message: "User already exists" });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashPassword,
        })


        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();
        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({
                id: user._id,
                message: "Signup successful",
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Something went wrong" });
    }
}


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User doesn't exists" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "User doesn't exists" });
        }

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        user.refreshToken = refreshToken;
        await user.save();

        res
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 15 * 60 * 1000 // 15 minutes
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                ssecure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            })
            .json({
                id: user._id,
                message: "Login successful",
            });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {

            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            return res.status(204).json({ message: "No refresh token found" });
        }

        const user = await User.findOne({ refreshToken });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.clearCookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const me = async (req, res) => {

    try {
        const user = await User.findById(req.user.id).select("-password -refreshToken");
        res.json({ user: user });
    } catch (error) {
        res.send("Could not fetch the user");
    }
}

export const refresh = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const newAccessToken = jwt.sign(
            { id: decoded._id, },
            process.env.JWT_SECRET,
            { expiresIn: "7m" }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 60 * 1000
        });

        return res.json({ success: true });
    } catch (error) {
        console.error("Refresh token verification failed:", error.message);
        return res.status(401).json({ message: "Refresh token is not valid" });
    }
};