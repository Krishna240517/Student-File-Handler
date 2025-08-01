import User from "../models/user.model.js";
import Group from "../models/group.model.js";
import s3 from "../lib/b2.js";
import { DeleteObjectCommand, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/* ADMIN CONTROLLERS */
export const createGroup = async (req, res) => {
    try {
        const currUser = await User.findById(req.user._id);
        if (currUser.role !== "admin") {
            return res.status(503).json({ msg: "Only Admins are allowed" });
        }

        const { name } = req.body;
        const newGroup = new Group({
            name,
            createdBy: req.user._id,
            members: [req.user._id]
        });
        await newGroup.save();
        currUser.groups.push(newGroup._id);
        await currUser.save();
        res.status(201).json({ msg: "New Group Created", group: newGroup });
    } catch (error) {
        console.error("Error in create group controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const deleteGroup = async (req, res) => {
    try {
        const currUser = await User.findById(req.user._id);
        if (currUser.role !== "admin") {
            return res.status(503).json({ msg: "Only Admins are allowed" });
        }

        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group Not Found" });
        }

        if (group.createdBy.toString() !== currUser._id.toString()) {
            return res.status(503).json({ msg: "Only Admins of the group are allowed" });
        }

        await group.deleteOne();
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (error) {
        console.error("Error in delete group controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const removeMember = async (req, res) => {
    try {
        const { groupId, userId } = req.params;
        const adminId = req.user._id;

        const [group, adminUser] = await Promise.all([
            Group.findById(groupId),
            User.findById(adminId).select("role _id")
        ]);

        if (!group) return res.status(404).json({ msg: "Group Not Found" });
        if (adminUser.role !== "admin") return res.status(403).json({ msg: "Only Admins are allowed" });
        if (group.createdBy.toString() !== adminUser._id.toString())
            return res.status(403).json({ msg: "Only group admins can remove members" });

        const isMember = group.members.some(
            (member) => member.toString() === userId.toString()
        );
        if (!isMember) return res.status(400).json({ msg: "User is not a member of the group" });

        group.members = group.members.filter(
            (member) => member.toString() !== userId.toString()
        );

        await Promise.all([
            group.save(),
            User.findByIdAndUpdate(
                userId,
                { $pull: { groups: groupId } },
                { new: true }
            )
        ]);

        res.status(200).json({ msg: "Member removed successfully" });
    } catch (error) {
        console.error("Error in remove member controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

/* USER CONTROLLERS */
export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group Not Found" });
        }

        const userId = req.user._id;

        if (!group.members.some(member => member.toString() === userId.toString())) {
            group.members.push(userId);
            await group.save();
        }

        const user = await User.findById(userId);
        if (!user.groups.some(gid => gid.toString() === groupId.toString())) {
            user.groups.push(groupId);
            await user.save();
        }

        res.status(200).json({ msg: `Joined Group: ${group.name}` });
    } catch (error) {
        console.error("Error in join group controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        if (!group.members.includes(userId)) {
            return res.status(400).json({ msg: "You are not a member of this group" });
        }

        const groupUpdate = Group.updateOne(
            { _id: groupId },
            { $pull: { members: userId } }
        );
        const userUpdate = User.updateOne(
            { _id: userId },
            { $pull: { groups: groupId } }
        );

        await Promise.all([groupUpdate, userUpdate]);

        res.status(200).json({ msg: "You have successfully left the group" });
    } catch (error) {
        console.error("Error in leaveGroup controller:", error.message);
        res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const getMyGroups = async (req, res) => {
    try {
        const currUser = await User.findById(req.user._id)
            .populate({
                path: "groups",
                select: "name createdBy members files",
                populate: {
                    path: "createdBy",
                    select: "name",
                }
            });
        res.status(200).json(currUser);
    } catch (error) {
        console.error("Error in get all groups controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const getGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId)
            .populate("members", "name")
            .populate("createdBy", "name")
            .populate("files");

        if (!group) {
            return res.status(404).json({ msg: "Group Not Found" });
        }
        res.status(200).json(group);
    } catch (error) {
        console.error("Error in get group controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
}
/* FILE HANDLING CONTROLLER */
export const uploadFile = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ msg: "No file uploaded" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        const isMember = group.members.some(
            (member) => member.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({ msg: "Only group members can upload files" });
        }

        const key = `${Date.now()}-${file.originalname}`;

        const uploadParams = {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        await s3.send(new PutObjectCommand(uploadParams));

        group.files.push({
            filename: file.originalname,
            key,
            uploadedBy: userId,
            groupId: group._id
        });

        await group.save();

        res.status(200).json({
            msg: "File uploaded successfully",
            file: {
                filename: file.originalname,
                url: fileUrl,
                key,
            }
        });
    } catch (error) {
        console.error("Error in upload file controller", error.message);
        return res.status(503).json({ msg: "Internal Server Error" });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const { groupId, fileId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        const file = group.files.id(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found" });
        }

        const isMember = group.members.some(
            (member) => member.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({ msg: "Only group members can delete files" });
        }

        if (
            file.uploadedBy.toString() !== userId.toString() &&
            group.createdBy.toString() !== userId.toString()
        ) {
            return res.status(403).json({ msg: "Unauthorized to delete" });
        }

        await s3.send(new DeleteObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: file.key,
        }));

        file.deleteOne();
        await group.save();

        res.status(200).json({ msg: "File deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFile controller", error.message);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};

export const getSignedUrlController = async (req, res) => {
    try {
        const { groupId, fileId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);

        if (!group) {
            return res.status(404).json({ msg: "Group not found" });
        }

        const isMember = group.members.some(
            (member) => member.toString() === userId.toString()
        );
        if (!isMember) {
            return res.status(403).json({ msg: "Access denied: not a group member" });
        }

        const file = group.files.id(fileId);
        if (!file) {
            return res.status(404).json({ msg: "File not found in group" });
        }

        const command = new GetObjectCommand({
            Bucket: process.env.B2_BUCKET_NAME,
            Key: file.key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return res.status(200).json({ url: signedUrl });
    } catch (error) {
        console.error("Error generating signed URL:", error.message);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
};