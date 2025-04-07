const mongoose = require('mongoose');
const blacklistTokenSchema = new mongoose.Schema({
  token: {
      type: String,
      required: true,
      unique: true
  },
  createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400 // Token expires automatically after 24 hours (in seconds)
  }
});

const blackListedTokenModel = mongoose.model('BlacklistedToken', blacklistTokenSchema);

module.exports = blackListedTokenModel;