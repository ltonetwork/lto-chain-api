// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex


router.get('/transaction/:id',
  [
    check('id').not().isEmpty().isLength({ min: 44, max: 88 })

  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getAnchors = await db('anchors')
        .select()
        .where('tid', req.params.id)
        .limit(1)

      getAnchors[0].anchors = JSON.parse(getAnchors[0].anchors)

      res.status(200).json(getAnchors[0])
    } catch (err) {
      next(err)
    }
  })

module.exports = router
