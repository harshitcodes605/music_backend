import express from "express";
import { signup } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

// Protected test route
router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

export default router;

