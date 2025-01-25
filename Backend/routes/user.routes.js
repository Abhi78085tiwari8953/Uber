const express = require('express');
const router = express.Router();
const {body} = require("express-validator")
const userController = require('../controller/user.controller');



router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({min:3}).withMessage('Firstname  name must be 3 letter'),
    body('password').isLength({min:5}).withMessage('Password must 5 letter')
])







module.exports = router;