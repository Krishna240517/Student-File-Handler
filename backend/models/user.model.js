import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    password: { type: String }, // will be undefined for OAuth users
    role:{
      type: String,
      enum:["user","admin"],
      default:"user"
    },

    // Google OAuth fields
    googleId: { type: String, unique: true, sparse: true }, // sparse allows multiple nulls
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    refreshToken: { type: String },
    groups:[{
      type: mongoose.Schema.Types.ObjectId,
      ref:"Group"
    }]
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
