// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

// Set Express App
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Helmet = require('helmet')
const Compression = require('compression')
const cors = require('cors')
const logger = require('morgan')
const figlet = require('figlet')

app.use(function (req, res, next) {
  res.locals.session = req.session
  return next()
})

// Compress
app.use(Helmet())
app.use(Compression())

// Set Body Parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Loger
app.use(logger('dev'))

// CORS
app.use(cors())

// Set Rate Limiter
const rateLimiter = require('./middleware/rateLimiter')

// Set Validator
const validator = require('express-validator')
app.use(validator())

// Public Routes
app.all('/',
rateLimiter,
function (req, res, next) {
      
  figlet('LTO Chain Cache API', function(err, data) {
    res.set('Content-Type', 'text/plain')
    res.status(200).send(`${data} v1.0 \n
      panel: lto.cloud
      docs: /v1/docs
      `)
  })
})


// Setup Swagger docs
const swagger = require('swagger-ui-express')
app.use('/v1/docs', rateLimiter, swagger.serve, swagger.setup(require('./docs/swagger.json')))

// app.use('/v1/status', rateLimiter, require('./routes/status'))

// Set Auth on Private Routes
const jwt = require('express-jwt')
const verifyToken = require('./middleware/verifyToken')

// app.all('/v1/*',
// jwt({
//  secret: process.env.APP_SECRET,
//  requestProperty: 'token'
// }),
// verifyToken,
// rateLimiter,
// function (req, res, next) {
//  next()
// })

// Private Routes
app.use('/v1/block', require('./routes/block'))
app.use('/v1/consensus', require('./routes/consensus'))
app.use('/v1/feature', require('./routes/feature'))
app.use('/v1/proof', require('./routes/proof'))
app.use('/v1/transaction', require('./routes/transaction'))
app.use('/v1/anchor', require('./routes/anchor'))
app.use('/v1/lease', require('./routes/lease'))
app.use('/v1/generator', require('./routes/generator'))
app.use('/v1/address', require('./routes/address'))
app.use('/v1/stats', require('./routes/stats'))

// Error Handling
app.use(function onError (err, req, res, next) {
  res.locals.error = process.env.DEBUG == true ? err : {}
  res.statusCode = err.status || 500
  res.set('Content-Type', 'application/json')
  res.status(res.statusCode).json(err.toString())
})

module.exports = app
