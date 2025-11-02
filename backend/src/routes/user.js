// routes/user.js
import express from "express";
import cors from "cors";
import authenticateToken from "../utils/authMiddleware.js";
import User from "../models/user.js";
import UserProfile from "../models/userProfile.js";

const router = express.Router();
router.use(cors());

// Get all users except logged-in user
router.get("/all", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Send follow request
router.post("/follow/:id", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    const targetProfile = await UserProfile.findOne({ userId: targetUserId });

    if (!targetProfile) return res.status(404).json({ message: "Target user profile not found" });

    if (targetProfile.followRequests.includes(currentUserId))
      return res.status(400).json({ message: "Follow request already sent" });

    targetProfile.followRequests.push(currentUserId);
    await targetProfile.save();

    res.json({ message: "Follow request sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending follow request", error });
  }
});

// Accept follow request
// Accept follow request (DEBUG VERSION)
router.post("/follow/accept/:id", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requesterId = req.params.id;

    console.log("✅ Accept request called");
    console.log("Current user:", currentUserId);
    console.log("Requester:", requesterId);

    const currentProfile = await UserProfile.findOne({ userId: currentUserId });
    const requesterProfile = await UserProfile.findOne({ userId: requesterId });

    console.log("Current profile found:", !!currentProfile);
    console.log("Requester profile found:", !!requesterProfile);

    if (!currentProfile)
      return res.status(404).json({ message: "Current user profile not found" });

    if (!requesterProfile)
      return res.status(404).json({ message: "Requester profile not found" });

    console.log("Current followRequests:", currentProfile.followRequests);

    if (!currentProfile.followRequests.includes(requesterId)) {
      return res.status(400).json({
        message: "No follow request from this user",
      });
    }

    // ✅ Update followers/following
    currentProfile.followers.push(requesterId);
    requesterProfile.following.push(currentUserId);

    // Remove from followRequests
    currentProfile.followRequests = currentProfile.followRequests.filter(
      (id) => id.toString() !== requesterId.toString()
    );

    await currentProfile.save();
    await requesterProfile.save();

    res.json({ message: "Follow request accepted successfully!" });
  } catch (error) {
    console.error("❌ Error in accept follow:", error);
    res.status(500).json({
      message: "Error accepting follow request",
      error: error.message || error,
    });
  }
});


// Reject follow request
router.post("/follow/reject/:id", authenticateToken, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requesterId = req.params.id;

    const currentProfile = await UserProfile.findOne({ userId: currentUserId });

    if (!currentProfile.followRequests.includes(requesterId))
      return res.status(400).json({ message: "No follow request from this user" });

    currentProfile.followRequests = currentProfile.followRequests.filter(
      (id) => id.toString() !== requesterId.toString()
    );

    await currentProfile.save();
    res.json({ message: "Follow request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting follow request", error });
  }
});

// Get incoming follow requests
router.get("/follow/requests", authenticateToken, async (req, res) => {
  try {
    const currentProfile = await UserProfile.findOne({ userId: req.user.id })
      .populate("followRequests", "name email");
    res.json(currentProfile.followRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching follow requests", error });
  }
});


router.get("/profile/:userId", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch basic user data
    const user = await User.findById(userId).select("name email role");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Fetch extended profile data
    const profile = await UserProfile.findOne({ userId });
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Combine data
    const fullProfile = {
      name: user.name,
      email: user.email,
      role: user.role,
      bio: profile.bio,
      designation: profile.designation,
      achievements: profile.achievements,
      followers: profile.followers,
      following: profile.following,
      followRequests: profile.followRequests,
      followersCount: profile.followers?.length || 0,
      followingCount: profile.following?.length || 0,
    };

    res.json(fullProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Error fetching profile", error });
  }
});



export default router;
