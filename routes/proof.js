// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get proof by id
router.get('/:proof',
  [
    check('proof')
      .not().isEmpty()
      .isLength({
        min: 88,
        max: 88
      })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getProof = await db('proofs')
        .select('tid', 'proof')
        .where('proofs', req.params.proof)

      res.json(getProof)
    } catch (err) {
      next(err)
    }
  })

// Get proof by tid
router.get('/transaction/:id',
  [
    check('id')
      .not().isEmpty()
      .isLength({
        min: 44,
        max: 44
      })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getProof = await db('proofs')
        .select('tid', 'proof')
        .where('tid', req.params.id)

      res.status(200).json(getProof)
    } catch (err) {
      next(err)
    }
  })

module.exports = router
