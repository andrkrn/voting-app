const mongoose = require('mongoose')
const Schema = mongoose.Schema
const autoIncrement = require('mongoose-auto-increment')

autoIncrement.initialize(mongoose.connection)

const PollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  poll_options: [{
    type: Schema.Types.ObjectId,
    ref: 'PollOption'
  }]
})

const PollOptionSchema = new Schema({
  _poll: {
    type: Schema.Types.ObjectId,
    ref: 'Poll'
  },
  name: {
    type: String,
    required: true
  }
})

PollSchema.plugin(autoIncrement.plugin, { model: 'Poll', })
PollOptionSchema.plugin(autoIncrement.plugin, { model: 'PollOption' })

const Poll = mongoose.model('Poll', PollSchema)
const PollOption = mongoose.model('PollOption', PollOptionSchema)

module.exports = {
  Poll,
  PollOption
}
