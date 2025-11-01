import express from "express";
import { signup, verifyOtp, login } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user,
  });
});

router.post("/resend-otp", resendOtp);

export default router;
