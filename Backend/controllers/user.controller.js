const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blackListToken.model');
const nodemailer = require('nodemailer');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
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


}

module.exports.loginUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

    res.cookie('token', token);

    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json(req.user);

}

module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out' });

}

module.exports.verificationOTP = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000);

        // Save OTP to user (or separate OTP collection, your choice)
        user.otp = otp;
        user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
        await user.save();

        // Setup Nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'at199159@gmail.com',
                pass: 'your_app_password' // Use App Passwords (not your Gmail password)
            }
        });

        const mailOptions = {
            from: 'at199159@gmail.com',
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It will expire in 5 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("OTP send error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await userModel.findOne({ email });

        if (!user || !user.otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "OTP expired or invalid" });
        }

        if (user.otp != otp) {
            return res.status(401).json({ message: "Incorrect OTP" });
        }

        // Clear OTP after successful verification
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("OTP verify error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


module.exports.changePassword = async (req, res) => {
    try {
        const { email, newPassword, repeatPassword } = req.body;

        // Ensure the passwords match
        if (newPassword !== repeatPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Find the user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await userModel.hashPassword(newPassword);

        // Update the user's password
        user.password = hashedPassword;
        user.otp = undefined;  // Clear OTP after password change
        user.otpExpires = undefined;  // Clear OTP expiration time
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
