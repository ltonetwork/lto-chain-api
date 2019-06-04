// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const { validationResult } = require('express-validator/check')

function validateInput (req, res, next) {
  try {
    const err = validationResult(req)

    if (!err.isEmpty()) {
      res.status(400).json(err.array())
    } else {
      next()
    }
  }
  catch(err) {
    next(err)
  }
}

module.exports = validateInput
