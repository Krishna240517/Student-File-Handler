
import jwt from "jsonwebtoken";
export const protect = (req, res, next) => {
    const token = req.cookies.accessToken;
    if(!token) {
        return res.status(401).json({ message: "No token provided, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.status(401).json({ message: "Token is not valid" });
    }
}