import jwt from "jsonwebtoken";

export const protectRoute = async(req, res, next) => {
    try {
        const token = req.cookies['tokload'];
        if(!token) {
            return res.status(400).json({message: "Token Not Found"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(400).json({message: "Unauthorized"});
        }
        req.user = decoded;
        next();
    } catch(error) {
        console.error("Error in protectRoute middleware");
        return res.status(503).json({ msg: "Internal Server Error" });
    }
}