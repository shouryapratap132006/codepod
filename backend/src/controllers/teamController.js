import User from "../models/user.js";
import UserProfile from "../models/userProfile.js";

export const getAllTeamMembers = async (req, res) => {
  try {
    // Get all users (excluding the currently logged-in user)
    const users = await User.find({ _id: { $ne: req.user.id } })
      .select("name email followers following");

    // Attach profile data for each user
    const profiles = await Promise.all(
      users.map(async (user) => {
        const profile = await UserProfile.findOne({ userId: user._id });
        return {
          ...user.toObject(),
          profile,
        };
      })
    );

    res.status(200).json(profiles);
  } catch (error) {
    console.error("Error fetching team members:", error);
    res.status(500).json({ message: "Server error" });
  }
};
