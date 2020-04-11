// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get consensus by block
router.get('/block/:index',
  [
    check('index').not().isEmpty().isInt({ min: 1 })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getConsensus = await db('consensus')
        .select()
        .where('index', req.params.index)

      res.status(200).json(getConsensus)
    } catch (err) {
      next(err)
    }
  })

// Get consensus by target range
router.get('/target/:start/:end',
  [
    check('start').not().isEmpty().isInt({ min: 1 }),
    check('end').not().isEmpty().isInt({ min: 1 })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getConsensus = await db('consensus')
        .select()
        .whereBetween('target', [req.params.start, req.params.end])

      res.status(200).json(getConsensus)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

// Get consensus by signature
router.get('/signature/:signature',
  [
    check('signature').not().isEmpty().isInt({ min: 44, max: 44 })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getConsensus = await db('consensus')
        .select()
        .where('signature', req.params.signature)

      res.status(200).json(getConsensus[0])
    } catch (err) {
      next(err)
    }
  })

module.exports = router
