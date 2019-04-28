const express = require('express')

let router = express.Router()

router.use('/user', require('./User'))
router.use('*', (req, res, next) => {
  const credentials = req.signedCookies.credentials
  if (credentials)
  {
    if (new Date().getTime() > credentials.upload)
    { // not now
      // return res.status(403).json({picture: 'upload picture time'})
    }
    return next()
  }

  res.status(403).json({error: 'No access'})
})
router.use('/group', require('./Group'))
router.use('/contest', require('./Contest'))


module.exports = router 