import express from "express";
import userProfile from "../models/userProfile.js"; // lowercase as requested
import User from "../models/user.js"; 
import authenticateToken from "../utils/authMiddleware.js"; // JWT middleware

const router = express.Router();

// GET user profile
router.get("/", authenticateToken, async (req, res) => {
  console.log("📡 Profile GET hit:", req.user); // debug log
  try {
    const user = await User.findById(req.user.id).select("name email");
    const profile = await userProfile.findOne({ userId: req.user.id });

    res.json({ user, profile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE or CREATE user profile
router.post("/", authenticateToken, async (req, res) => {
  const { bio, designation, achievements } = req.body;

  try {
    let profile = await userProfile.findOne({ userId: req.user.id });

    if (profile) {
      profile.bio = bio;
      profile.designation = designation;
      profile.achievements = achievements;
    } else {
      profile = new userProfile({
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
