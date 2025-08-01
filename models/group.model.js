import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    filename: String, //original file name
    key: String, //file key in Backblaze B2
    url:String, //public URL(or signed URL)
    uploadedBy:{
        type:mongoose.Schema.Types.ObjectId, ref: "User"
    },
    uploadedAt:{
        type: Date,
        default: Date.now
    },
    groupId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Group"
    }
})


const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true, 
    },

    createdBy: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    members: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],

    files:[fileSchema]
    
},{timestamps: true})

const Group = mongoose.model("Group",groupSchema);
export default Group;