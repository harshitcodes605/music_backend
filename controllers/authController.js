import dotenv from "dotenv";
dotenv.config();
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendGrid from "@sendgrid/mail";
import OtpVerification from "../models/OtpVerification.js";
sendGrid.setApiKey(process.env.SENDGRID_API);
console.log("Email check:", process.env.EMAIL_USER, process.env.EMAIL_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

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

const hashedPassword = await bcrypt.hash(password, 10);

await OtpVerification.findOneAndUpdate(
  { email },
  { $set: { otp, username, password: hashedPassword, createdAt: new Date() } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);

    const msg ={
      to:email,
      from:process.env.EMAIL_USER,
      subject:"Complete Your Signup - OTP Verification",
      text:`Welcome ${username}, enter this OTP to complete your signup: ${otp}`,
      html: `
     <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Welcome, ${username}!</h2>
      <p>Thank you for signing up for our Music Recommendation platform 🎵</p>
      <p>Please use the OTP below to complete your signup:</p>
      <h1 style="color: #2F8FED; letter-spacing: 2px;">${otp}</h1>
      <p>This OTP will expire in a few minutes.</p>
      <p>Regards,<br><strong>The Audient Team</strong></p>
    </div>
  `,
};

    try{
      await sendGrid.send(msg);
      console.log('email is send')
    }catch(error){
      console.log("email not send", error)
    }

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
    const record = await OtpVerification.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }

    const otpAge = (Date.now() - record.createdAt.getTime()) / 60000; 
    if (otpAge > 5) {
      await OtpVerification.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired. Please request again." });
    }

    if (String(record.otp) !== String(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const newUser = new User({
      username: record.username,
      email,
      password: record.password,
    });
    await newUser.save();

    await OtpVerification.deleteOne({ email });

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
