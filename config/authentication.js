const path = require('path')
const basicAuth = require('basic-auth')
const config = require(path.resolve( __dirname, './local-config.json'))
const isDev = !(process.env.NODE_ENV === 'production')
const login = {
  user: isDev && config ? config.AUTH_USER : process.env.AUTH_USER,
  pass: isDev && config ? config.AUTH_PASS : process.env.AUTH_PASS
}

const auth = (req, res, next) => {
  const user = basicAuth(req)
  if (!user || !user.name || !user.pass) {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    res.status(401).send('Authorization Required')
    return
  }
  if (user.name === login.user && user.pass === login.pass) {
    next()
  } else {
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
    res.status(401).send('Authorization Required')
    return
  }
}

module.exports = auth