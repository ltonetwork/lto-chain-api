// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const db = require('../utils/utils').knex
const { RateLimiterMemory } = require('rate-limiter-flexible')

const ready = err => {
  if (err) {
    console.log(err.toString())
  }
}
const RateLimiter = new RateLimiterMemory({
  storeClient: db,
  storeType: 'knex',
  dbName: process.env.DB_NAME,
  tableName: 'limiter',
  points: process.env.LIMIT_TOTAL,
  duration: process.env.LIMIT_EXPIRE
}, ready)

async function rateLimiter (req, res, next) {
  RateLimiter.consume(req.headers['x-real-ip'] || req.headers.host)
    .then(() => {
      next()
    })
    .catch(rejRes => {
      const ms = 1000 * Math.round(process.env.LIMIT_EXPIRE / 1000)
      const d = new Date(ms)

      res.status(429).json('Too Many Requests. You may make ' + process.env.LIMIT_TOTAL + ' requests every ' + d.getUTCMinutes() + ' minutes.')
    })
}

module.exports = rateLimiter
