import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
    try {
        const { name } = req.body;
        const currUser = await User.findById(req.user.id);
        if (!currUser) {
            return res.status(404).json({ msg: "User not found" });
        }

       
        currUser.name = name;
        await currUser.save();

        const safeUser = currUser.toObject();
        delete safeUser.password;
        res.json({ msg: "Name updated Successfully", user: safeUser });
    } catch (error) {
        console.error("Error in update profile");
        return res.status(500).json({ msg: "Error in updateProfile" });
    }
}