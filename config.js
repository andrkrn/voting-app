module.exports = {
  db: {
    host: 'localhost',
    name: 'voting-app'
  },
  facebook: {
    app_id: process.env.FACEBOOK_APP_ID,
    app_secret: process.env.FACEBOOK_APP_SECRET
  },
  port: process.env.PORT || 3000,
}
