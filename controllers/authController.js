import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
console.log("Email check:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const otpStore = new Map();

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    if (!email.endsWith("@gmail.com"))
      return res.status(400).json({ message: "Email must end with @gmail.com" });

    const passwordRegex = /^[A-Za-z0-9]{6,}$/;
    if (!passwordRegex.test(password))
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain only letters or digits",
      });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const otp = Math.floor(100000 + Math.random() * 900000); 
    otpStore.set(email, { otp, username, password }); 

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email - Music Recommendation App",
      html: `<h3>Hello ${username} 👋</h3>
             <p>Your OTP for verification is:</p>
             <h2>${otp}</h2>
             <p>This OTP is valid for 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "OTP sent successfully. Please verify to complete signup.",
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Error during signup / sending OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = otpStore.get(email);

    if (!record || record.otp !== Number(otp))
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const { username, password } = record;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    otpStore.delete(email);

    res.status(201).json({
      message: "Email verified and user registered successfully!",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ message: "Server error during OTP verification" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide email and password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};
