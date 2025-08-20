import crypto from "crypto";
import Group from "../models/group.model.js";
import File from "../models/file.model.js";
import { s3 } from "../config/s3.js";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const { groupId } = req.body;
        const group = await Group.findById(groupId);
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const uniqueKey = `uploads/${Date.now()}-${crypto.randomUUID()}-${file.originalname}`;

        const params = {
            Bucket: process.env.B2_BUCKET_NAME,
            Key: uniqueKey,
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        await s3.send(new PutObjectCommand(params));

        //save the metadata into DB
        const newFile = new File({
            key: uniqueKey,
            bucket: process.env.B2_BUCKET_NAME,
            group: groupId,
            uploader: req.user.id,
            originalName: file.originalname,
            contentType: file.mimetype,
            size: file.size
        })
        await newFile.save();
        group.files.push(newFile._id);
        await group.save();

        res.status(201).json({
            message: "File uploaded successfully.",
            file: newFile
        });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Failed to upload file.", error: error.message });
    }
}

export const getDownloadUrl = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found in database." });
        }

        const params = {
            Bucket: file.bucket,
            Key: file.key
        };

        const command = new GetObjectCommand(params);

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });

        res.status(200).json({
            message: "Download URL generated successfully.",
            url: signedUrl,
        });
    } catch (error) {
        console.error("Error generating download URL:", error);
        res.status(500).json({ message: "Failed to generate download URL.", error: error.message });
    }
}

export const deleteFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.fileId);
        if (!file) {
            return res.status(404).json({ message: "File not found in database." });
        }
        const deleteParams = {
            Bucket: file.bucket,
            Key: file.key
        }
        const command = new DeleteObjectCommand(deleteParams);
        await Promise.all([
            s3.send(command),
            Group.updateOne(
                { _id: file.group },
                { $pull: { files: file._id } }
            ),
            File.deleteOne({ _id: file._id })
        ])
        res.status(200).json({
            message: "File Deleted Successfully"
        });
    } catch (error) {
        console.error("Error deleting the file :", error);
        res.status(500).json({ message: "Failed to delete the file.", error: error.message });
    }
}
