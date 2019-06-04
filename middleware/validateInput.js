// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const { check } = require('express-validator/check')

function validateInput (req, res, next) {
  try {
    const err = check(req)

    if (!err.isEmpty()) {
      res.status(res.statusCode).json(err.toString())
    } else {
      next()
    }
  }
  catch(err) {
    next(err)
  }
}

module.exports = validateInput
