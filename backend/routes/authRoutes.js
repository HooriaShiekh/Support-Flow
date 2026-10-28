const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const transporter = require('../config/nodemailer'); // <-- Professional way (Importing transporter)
const jwt = require('jsonwebtoken');

// ==========================================
// 1. INDUSTRIAL SIGNUP ROUTE
// ==========================================
router.post('/signup', async (req, res) => {
  try {
    const { name, email, contactNumber, password, role, category } = req.body;

    // Check if all required fields are present
    if (!name || !email || !contactNumber || !password) {
      return res.status(400).json({ message: 'All fields are mandatory, including contact number' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Account with this email already exists' });
    }

    // Create user (Pre-save hook will automatically hash the password)
    const user = await User.create({ 
      name, 
      email, 
      contactNumber, 
      password,
      role: role || 'user', // Default to 'user' if not provided
      category: role === 'worker' ? category : undefined 
    });

    res.status(201).json({ 
      success: true,
      message: 'Account created successfully! Redirecting to login...',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, category: user.category }
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ==========================================
// 2. INDUSTRIAL LOGIN ROUTE
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // JWT Token generate karna
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET || 'secretkey123', 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token: token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        category: user.category 
      }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==========================================
// 3. FORGOT PASSWORD ROUTE
// ==========================================
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    // Generate secure 6-digit token
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Hash token before saving to DB
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins expiry
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Security: Password Reset Verification Code',
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; background-color: #F9FBF8; color: #2C3E2B; border-radius: 12px; max-width: 500px; margin: auto; border: 1px solid #E2E8DF;">
          <h2 style="color: #3A4F35; text-align: center; margin-bottom: 20px;">SupportFlow Security</h2>
          <p style="font-size: 14px; color: #5A6E58;">Hello <b>${user.name}</b>,</p>
          <p style="font-size: 14px; color: #5A6E58;">You requested a password reset for your account. Use the verification code below:</p>
          <div style="background: #ffffff; border: 1px solid #C8E6C9; color: #2E7D32; padding: 15px 20px; font-size: 28px; font-weight: bold; text-align: center; border-radius: 8px; letter-spacing: 4px; margin: 25px 0;">
            ${resetToken}
          </div>
          <p style="font-size: 12px; color: #687A66; text-align: center;">This verification code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification code sent to your email successfully!' 
    });

  } catch (error) {
    console.error("FORGOT PASSWORD ERROR DETAIL:", error.message);
    res.status(500).json({ message: error.message || 'Error sending email. Please try again later.' });
  }
});

// ==========================================
// 4. RESET PASSWORD ROUTE
// ==========================================
router.post('/reset-password', async (req, res) => {
  try {
    console.log("🔍 FULL REQ BODY:", req.body);
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Hash the incoming token to match with DB stored hash
    const cleanToken = token.toString().trim();
    const hashedToken = crypto.createHash('sha256').update(cleanToken).digest('hex');

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification code' });
    }

    // Update password (pre-save hook will hash this new password automatically)
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully. You can now login.' });
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});




module.exports = router;