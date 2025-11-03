// routes/user.js
import express from "express";
import cors from "cors";
import getUser from "../controllers/user.js";
import authenticateToken from "../utils/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();
router.use(cors());

// Get all users
router.get("/users", authenticateToken, getUser);

// Get currently logged-in user
// router.get("/me", authenticateToken, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     if (!user) return res.status(404).json({ error: "User not found" });
//     res.json({ name: user.name, email: user.email });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


export default router;
