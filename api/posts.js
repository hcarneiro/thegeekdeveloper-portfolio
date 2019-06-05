const express = require('express')
const router = express.Router()
const mediumJSONFeed = require('medium-json-feed')

router.get('/', async (req, res) => {
  mediumJSONFeed('@hugodesigns/latest')
    .then((data) => {
      res.send(data)
    })
    .catch((data) => {
      res.send(data)
    })
})

module.exports = router