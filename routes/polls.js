const express = require('express')
const isAuthenticated = require('../utilities/util').isAuthenticated

const Poll = require('../models/poll')
const router = express.Router()

router.use((req, res, cb) => {
  console.log('Polls routes')
  cb()
})

router.get('/', (req, res) => {
  res.send('Index page for polls');
})

router.post('/', isAuthenticated, (req, res) => {
  let spaceOnly = /^\s*$/g
  let pollAttributes = {}
  let options = req.body['option[]'].filter((option) => !spaceOnly.test(option))

  pollAttributes.title = req.body.title
  pollAttributes.owner = req.user._id
  pollAttributes.results = {}
  pollAttributes.voted_by = []

  for(var i = 0; i < options.length; i++) {
    pollAttributes.results[options[i]] = 0
  }

  let newPoll = new Poll(pollAttributes)
  newPoll.save((err) => {
    if (err) { console.log(err) }

    res.redirect('/my-polls')
  })
})

router.get('/new', (req, res) => {
  res.render('polls/new')
})

router.get('/:poll_id', (req, res) => {
  Poll.findById(req.params.poll_id, (err, poll) => {
    if (err) { console.log(err) }

    res.render('polls/show', {
      poll: poll
    })
  })
})

router.post('/:poll_id/vote', (req, res) => {
  Poll.findById(req.params.poll_id, (err, poll) => {
    if (err) {
      res.send(404)
    } else {
      var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      var userHaveNotVoted = req.isAuthenticated() && poll.voted_by.indexOf(req.user.id) === -1
      var ipHaveNotVoted = poll.voted_by.indexOf(clientIp) === -1
      var inc = {}
      var who_voting = []
      inc[`results.${req.body.vote}`] = 1

      if (userHaveNotVoted) {
        who_voting.push(req.user.id)
      }

      if (ipHaveNotVoted) {
        who_voting.push(clientIp)
      }

      if (userHaveNotVoted || ipHaveNotVoted) {
        console.log('Updating record...');

        poll.update({
          $inc: inc,
          $push: { voted_by: { $each: who_voting }}
        }).exec()

        console.log('Record updated, redirecting...')
      } else {
        console.log('User or ip address have voted to the poll.')
      }

      res.redirect(`/polls/${poll.id}`)
    }
  })
})

module.exports = router
