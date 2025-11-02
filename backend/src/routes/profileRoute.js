import express from "express";
import UserProfile from "../models/userProfile.js"; // lowercase as requested
import User from "../models/user.js"; 
import authenticateToken from "../utils/authMiddleware.js"; // JWT middleware

const router = express.Router();

// ✅ GET logged-in user's profile
router.get("/", authenticateToken, async (req, res) => {
  console.log("📡 Profile GET hit:", req.user); // debug log
  try {
    const user = await User.findById(req.user.id).select("name email");

    // fetch user profile
    const profile = await UserProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Add follower/following count
    const followersCount = profile.followers?.length || 0;
    const followingCount = profile.following?.length || 0;

    res.json({
      name: user.name,
      email: user.email,
      bio: profile.bio,
      designation: profile.designation,
      achievements: profile.achievements,
      followersCount,
      followingCount,
      followers: profile.followers,
      following: profile.following,
    });
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE or CREATE user profile
router.post("/", authenticateToken, async (req, res) => {
  const { bio, designation, achievements } = req.body;

  try {
    let profile = await UserProfile.findOne({ userId: req.user.id });

    if (profile) {
      profile.bio = bio;
      profile.designation = designation;
      profile.achievements = achievements;
    } else {
      profile = new UserProfile({
        userId: req.user.id,
        bio,
        designation,
        achievements,
      });
    }

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
