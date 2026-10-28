const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Nodemailer Transporter Setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. REGISTER
const registerUser = async (req, res) => {
  try {
    const { name, email, contactNumber, password, role, category } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ 
      name, 
      email, 
      contactNumber, 
      password, 
      role: role || 'user',
      category: role === 'worker' ? category : undefined // Agar worker hai toh category save ho gi
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    // Model ke method ya bcrypt.compare se password verify karein
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, category: user.category } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Code - support Flow',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${user.name},</p>
          <p>You requested to reset your password. Use the verification code below:</p>
          <div style="background: #111; color: #fff; padding: 10px 20px; font-size: 20px; font-weight: bold; text-align: center; border-radius: 5px; width: fit-content; margin: 20px 0;">
            ${resetToken}
          </div>
          <p>This code is valid for 10 minutes only.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset code sent to your email successfully!' });
  } catch (err) {
    console.log("NODEMAILER EXACT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// 4. RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    console.log("--- RESET PASSWORD DEBUG ---");
    console.log("Email received:", email);
    console.log("Token received:", token);

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'Missing required fields (email, token, or newPassword)' });
    }

    // Hash generated token
    const cleanToken = token.toString().trim();
    const hashedToken = crypto.createHash('sha256').update(cleanToken).digest('hex');
    console.log("Hashed token generated:", hashedToken);

    // Step A: Check if User exists by Email ONLY (For Precise Debugging)
    const userByEmail = await User.findOne({ email: email.trim().toLowerCase() });
    
    if (!userByEmail) {
      console.log("❌ Debug: No user found with this email!");
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    console.log("DB Saved Token:", userByEmail.resetPasswordToken);
    console.log("DB Expiry Time:", userByEmail.resetPasswordExpires);
    console.log("Current Time:", new Date());

    // Step B: Match with Token and Expiry Date
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      $or: [
        { resetPasswordToken: hashedToken },
        { resetPasswordToken: cleanToken } // Fallback agar DB mein plain token saved ho
      ],
      resetPasswordExpires: { $gt: new Date() }
    });

    console.log("User matched with Token & Expiry?:", user ? "YES ✅" : "NO ❌");

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired code' });
    }

    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log("✅ Password successfully updated!");
    res.json({ message: 'Password updated successfully!' });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};