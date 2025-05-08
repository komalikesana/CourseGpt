const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../models/User');

// Signup route
router.post('/signup', async (req, res) => {
  console.log('Handling /api/auth/signup request:', req.body);

  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      console.log('User already exists for email:', email);
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ email, password });

    // Hash password (assuming this is handled in the User schema pre-save hook, if not, we can add it here)
    await user.save();
    console.log('User created for email:', email);

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Signup successful for email:', email);

    res.json({ token });
  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log('Handling /api/auth/login request:', req.body);

  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ msg: 'Email and password are required' });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare password using the custom comparePassword method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for email:', email);

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    console.log('Handling Google OAuth callback for user:', req.user.email);
    // Generate JWT for Google user
    const payload = { user: { id: req.user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect to frontend with token
    res.redirect(`http://localhost:3000/lesson?token=${token}`);
  }
);

module.exports = router;