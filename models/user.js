const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  provider: {
    type: String,
    required: true
  },
  provider_id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
})

const User = mongoose.model('User', UserSchema)

module.exports = User
