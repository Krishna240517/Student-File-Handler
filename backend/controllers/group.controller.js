import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import crypto from "crypto";
export const createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const newGroup = new Group({
            groupName: name,
            createdBy: req.user.id,
            members: [req.user.id]
        });
        await newGroup.save();
        res.status(201).json({
            message: "Group created successfully",
            group: newGroup,
        });

        await User.findByIdAndUpdate(req.user.id, {
            $push: { groups: newGroup._id },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const joinGroup = async (req, res) => {
    try {
        const { code } = req.body;

        const [user, group] = await Promise.all([
            User.findById(req.user.id),
            Group.findOne({ joinCode: code })
        ]);

        if (!group) {
            return res.status(404).json({ msg: "Invalid Join Code" });
        }
        if (group.createdBy.toString() === req.user.id.toString()) {
            return res.status(400).json({ msg: "You are the creator of this group" });
        }
        if (group.members.includes(req.user.id)) {
            return res.status(400).json({ msg: "Already Member of the Group" });
        }
        group.members.push(req.user.id),
        user.groups.push(group._id)
        await Promise.all([
            group.save(),
            user.save()
        ]);
        res.json({ msg: "Joined group successfully", group });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const [group] = await Promise.all([
            Group.findById(groupId)
        ]);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }
        if (!group.members.includes(req.user.id)) {
            return res.status(400).json({ msg: "Not a Member of the Group" });
        }
        await Promise.all([
            User.updateOne(
                { _id: req.user.id },
                { $pull: { groups: groupId } }
            ),

            Group.updateOne(
                { _id: groupId },
                { $pull: { members: req.user.id } }
            )
        ]);

        res.json({ msg: "Left group successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getMyGroups = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "groups",
            populate: {
                path: "createdBy",
                select: "name",
            }
        });
        res.json({ userGroups: user.groups });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const regenerateCode = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group Not found" });
        }
        if (group.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({ msg: "Not allowed" });
        }

        group.joinCode = crypto.randomBytes(3).toString("hex").toUpperCase();
        await group.save();
        res.json({ msg: "Join code regenerated", joinCode: group.joinCode });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getSpecificGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId)
        .populate("members","name email")
        .populate("createdBy","name")
        .populate("files","originalName contentType")
        .select("-joinCode")
        ;
        if (!group) {
            return res.status(404).json({ msg: "Group Not found" });
        }
        res.json({ group: group });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
