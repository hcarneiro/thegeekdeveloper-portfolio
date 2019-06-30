const path = require('path')
const Sequelize = require('sequelize')
const env = (process.env.NODE_ENV).toLowerCase()
const config = require(path.resolve(__dirname, './local-config.json'))
const redis = require('redis')
const bluebird = require('bluebird')
const dev = !(env === 'production')

bluebird.promisifyAll(redis.RedisClient.prototype)

const DATABASE_URL = !dev ? process.env.DATABASE_URL : config.DATABASE_URL

// Max time in seconds a redis lock can be held
const MAX_LOCK_TIME = 120

const database = {}

database.redis = redis.createClient(!dev ? process.env.REDIS_URL : config.redis)

const operationsColors = {
  INSERT: 32, // green
  UPDATE: 33, // yellow
  DELETE: 31 // red
}

const dbLogging = config.query_logging ? function (query) {
  let color = 2 // dim

  Object.keys(operationsColors).some(function (op) {
    if (query.indexOf(`Executing (default): ${op}`) === 0) {
      color = operationsColors[op]
      return true // short-circuit
    }
  })

  console.log(`\x1b[36m<Query>\x1b[0m \x1b[${color}m%s\x1b[0m`, query)
} : false

database.db = new Sequelize(DATABASE_URL, {
  logging: dbLogging,
  dialect: 'postgres',
  dialectOptions: {
    ssl: !dev
  },
  pool: {
    max: 25,
    min: 0,
    idle: 10000
  }
})

module.exports = database
