const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
      token:{
        type:String,
        require:true,
        unique:true
      },
      createdAt: {
        type:Date,
        default:Date.now,
        expires:86400// 24 hour in second
      }
});


model.export = mongoose.model('BlacklistToken',blacklistTokenSchema);