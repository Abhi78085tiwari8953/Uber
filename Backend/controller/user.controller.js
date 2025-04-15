const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

// Register a new user
module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstname: fullname.firstname,
      lastname: fullname.lastname,
      email,
      password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    next(error);
  }
};

// Login user
module.exports.loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 86400000 // 1 day
    });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    next(error);
  }
};

// Get user profile
module.exports.getUserProfile = async (req, res, next) => {
  try {
    res.status(200).json(req.user); // req.user should be populated by auth middleware
  } catch (error) {
    console.error('Profile error:', error);
    next(error);
  }
};

// Logout user
module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie('token');

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (token) {
      await blackListTokenModel.create({ token });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    next(error);
  }
};
