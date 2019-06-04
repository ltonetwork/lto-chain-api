// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get address by id
router.get('/:address',
  [
    check('address')
      .not().isEmpty()
      .isLength({
        min: 35,
        max: 35
      })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getAddress = await db('addresses')
        .select(db.raw('*, date_format(updated,"%Y-%m-%d %h:%i:%s") as updated'))
        .where('address', req.params.address)
        .limit(1)

      res.json(getAddress[0])
    } catch (err) {
      next(err)
    }
  })

module.exports = router
