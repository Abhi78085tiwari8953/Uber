const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be at least 3 charcters']
        },
        lastname:{
            type:String,
            
            minlength:[3,'Last name must be at least 3 charcters']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,'Email must be at least 3 charcters']
    },
    password:{
           type:String,
           required:true,
           select:false
    },
    socketId:{
        type:String
    }
});


userSchema.methods.generateAuthToken = function ()  {
    const token = JsonWebTokenError.sign({_id: this._id},process.env.JWT_SECRET)
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.statics.hashPassword = async function (password){
    return await bcrypt.hash(password,10);

}

const userModel = mongoose.model('userModel',userSchema);

module.exports = userModel;