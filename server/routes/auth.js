const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/emailService');

const router = express.Router();

// JWT generator
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//
// ================= OTP ROUTES =================
//

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const otp = await sendOTPEmail(email);

    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    res.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({
    email,
    otp,
    otpExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired OTP'
    });
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Email verified successfully' });
});

//
// ================= AUTH ROUTES =================
//

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
      isEmailVerified: false
    });

    // Send OTP (non-critical)
    try {
      const otp = await sendOTPEmail(email);
      user.otp = otp;
      user.otpExpires = Date.now() + 10 * 60 * 1000;
      await user.save();
    } catch (err) {
      console.error('⚠️ OTP email failed during registration:', err.message);
    }

    res.status(201).json({
      success: true,
      requiresVerification: true,
      message: 'Registration successful. OTP sent to email.'
    });

  } catch (err) {
    console.error('❌ Registration error:', err);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  if (!user.isEmailVerified) {
    const otp = await sendOTPEmail(email);
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    return res.status(401).json({
      success: false,
      requiresVerification: true,
      message: 'OTP sent to your email'
    });
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

// Protected example
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, data: req.user });
});

module.exports = router;
