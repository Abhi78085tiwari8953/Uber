const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters']
    },
    lastname: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters']
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters']
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  socketId: {
    type: String
  }
});

// 🔥 FIX: `JsonWebTokenError` → `jwt`
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '24h' } // 🔥 FIX: added 'h' to indicate hours
  );
  return token;
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Static method to hash password
userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

// 🔥 FIX: model name should be singular and capitalized
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
