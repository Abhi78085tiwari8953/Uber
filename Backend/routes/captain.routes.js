const captainController = require('../controller/captain.controller');
const express = require('express');
const { body } = require("express-validator");
const authMiddleware = require('../middleware/auth.middleware')
const router = express.Router();

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname')
        .isString().withMessage('First name must be a string')
        .isLength({ min: 3 }).withMessage('First name must be at least 3 characters'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('vehicle.color')
        .isString().withMessage('Color must be a string')
        .isLength({ min: 3 }).withMessage('Color must be at least 3 characters'),
    body('vehicle.plate')
        .isString().withMessage('Plate must be a string')
        .isLength({ min: 3 }).withMessage('Plate must be at least 3 characters'),
    body('vehicle.capacity')
        .isNumeric().withMessage('Capacity must be a number'),
    body('vehicle.vehicleType')
        .isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be car, motorcycle, or auto')
],
captainController.registerCaptain);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
],
captainController.loginCaptain);


router.get('/profile',authMiddleware.authCaptain, captainController.getCaptainProfile)
router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain)

module.exports = router;
