const express = require('express')
const router = express.Router()
const {sendEmail} = require('../services/mailerService')

router.get('/test-email', async (req, res, next) => {
  try {
    await sendEmail({
      to: 'ms.septian@gmail.com', //fill with email address
      subject: 'Test Email 🚀',
      html: '<h1>Hello from Nodemailer</h1>'
    })

    res.json({ message: 'Email sent successfully' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
