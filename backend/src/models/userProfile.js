import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bio: { type: String, default: "" },
  designation: { type: String, default: "" },
  achievements: [{ type: String }],
});

const userProfile = mongoose.model("userProfile", userProfileSchema);

export default userProfile;
