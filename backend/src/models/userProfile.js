import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String, default: "" },
  designation: { type: String, default: "" },
  achievements: [{ type: String }],

  // 👇 Follow system
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],    // users who follow this profile
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],    // users this profile follows
  followRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // pending follow requests
});

const UserProfile = mongoose.model("UserProfile", userProfileSchema);
export default UserProfile;
