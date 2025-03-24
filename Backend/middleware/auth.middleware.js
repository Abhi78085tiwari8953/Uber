const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.authUser = async(req, res ,next)=>
{
    const token = req.cookies||req.headers.autorization?.split(' ')[1];

if(!token){
    return res.status(401).json({message:"unathorized"});
}
     const isBlacListed = await userModel.findOne({token:token});

     if(isBlacListed){
        return res.status(401).json({message:'UnauthoriZed'});
     }

try{
    const decode = jwt.verify(token,process.env.JWT_SECRET);
    const user = await userModel.findById(decode._id)

    req.user = user;
    return next();
} catch (err) {
    return res.status(401).json({message:"unauthorized token"})
}
}