const express = require('express');
const router = express.Router();
const {body} = require("express-validator")
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware')


router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname  name must be 3 letter'),
    body('password').isLength({min:5}).withMessage('Password must 5 letter')
],
userController.registerUser
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({min:5}).withMessage('Password must 5 letter')
],
userController.loginUser
)

router.get('/profile', authMiddleware.authUser,userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)







module.exports = router;