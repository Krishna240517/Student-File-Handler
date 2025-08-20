import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    key: String,
    bucket: String,
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    originalName: String,
    contentType: String,
    size: Number,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("File", fileSchema);