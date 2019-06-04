// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get feature by block index
router.get('/:index',
[
  check('index')
  .not().isEmpty()
  .isInt({
    min: 1
  })
],
validateInput,
async function (req, res, next) {
  try {
    const getFeatures = await db('features')
      .select('index', 'feature')
      .where('index', req.params.index)

    res.json(getFeatures)
  } catch (err) {
    next(err)
  }
})

module.exports = router
