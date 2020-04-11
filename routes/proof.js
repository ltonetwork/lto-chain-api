// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get proof by tid
router.get('/transaction/:id',
  [
    check('id').not().isEmpty().isLength({ min: 44, max: 44 })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getProofs = await db('proofs')
        .select('tid', 'proofs')
        .where('tid', req.params.id)
        .limit(1)

        getProofs[0].proofs = JSON.parse(getProofs[0].proofs)

      res.status(200).json(getProofs[0])
    } catch (err) {
      next(err)
    }
  })

module.exports = router
