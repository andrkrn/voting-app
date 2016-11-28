const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PollSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  results: Object,
  voted_by: []
})

const Poll = mongoose.model('Poll', PollSchema)

module.exports = Poll
