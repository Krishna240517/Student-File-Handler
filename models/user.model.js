import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },

    email:{
        type: String,
        required: true,
        unique: true,
    },

    password:{
        type: String,
        required: true,
    },

    role: {
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    groups:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Group"
        }
    ]
},{timestamps: true})

const User = mongoose.model("User",userSchema);

export default User;