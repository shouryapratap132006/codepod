import express from "express"
import cors from "cors"
import getUser from "../controllers/user.js";
import authenticateToken from "../utils/authMiddleware.js"

const router = express.Router();
router.use(cors())
router.get("/users",authenticateToken,getUser);

export default router;