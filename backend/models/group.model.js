import mongoose from "mongoose";
import crypto from "crypto";

const groupSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true,
        unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }], 

    files: [{type: mongoose.Schema.Types.ObjectId, ref:"File"}],

    joinCode: { type: String, unique: true },

}, { timestamps: true })


groupSchema.pre("save", function (next) {
    if (!this.joinCode) {
        this.joinCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // e.g., "A1B2C3"
    }
    next();
});


const Group = mongoose.model("Group", groupSchema);
export default Group;