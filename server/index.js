const express = require('express')
const consola = require('consola')
const cors = require('cors')
const aws = require('aws-sdk')
const helmet = require('helmet')
const busboy = require('connect-busboy')
const bodyParser = require('body-parser')
const busboyBodyParser = require('busboy-body-parser')
const compression = require('compression')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const appPackage = require('../package')
const auth = require('../config/authentication')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')
let private
if (config.dev) {
  private = require('../config/private.json')
}

require('../api/models/index')

app.use(compression())
app.use(helmet({
  frameguard: false,
  hidePoweredBy: { setTo: 'The Geek Developers' }
}))

// AWS configuration
aws.config.update({
  accessKeyId: config.dev && private ? private.AWS.ACCESS_KEY_ID : process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: config.dev && private ? private.AWS.SECRET_ACCESS_KEY : process.env.AWS_SECRET_ACCESS_KEY,
  region: config.dev && private ? private.S3.BUCKET_REGION : process.env.S3_BUCKET_REGION
})

app.use(cors())

app.use(busboy())
app.use(bodyParser.json({ limit: '1000mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '1000mb', parameterLimit: 50000 }))
app.use(bodyParser.text())
app.use(busboyBodyParser())

// Authentication
app.get('/auth', auth, (req, res) => {
  res.redirect('/')
})
app.get('/logout', (req, res) => {
  res.set('Authorization', 'Basic xxx')
  res.status(401).send('Logged out')
})

app.get('/api', (req, res) => {
  res.send({
    status: 'ok',
    environment: process.env.NODE_ENV,
    version: appPackage.version
  })
})

// Routes
app.use('/api/projects', require('../api/projects'))
app.use('/api/upload', require('../api/upload'))
app.use('/api/posts', require('../api/posts'))

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
