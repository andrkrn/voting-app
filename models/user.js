const mongoose = require('mongoose')
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection)

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

UserSchema.plugin(autoIncrement.plugin, {
  model: 'User',
})

const User = mongoose.model('User', UserSchema)

module.exports = User
