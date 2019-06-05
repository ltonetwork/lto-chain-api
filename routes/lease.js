// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Get all leases
router.get('/all', async function (req, res, next) {
  try {
    const getLeases = await db('transactions')
      .select()
      .whereBetween('type', [8, 9])

    res.status(200).json(getLeases)
  } catch (err) {
    next(err)
  }
})

// Get lease by leaseId
router.get('/:id',
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
    const getLeases = await db('transactions')
      .select()
      .where('leaseId', req.params.id)

    res.status(200).json(getLeases)
  } catch (err) {
    next(err)
  }
})

// Get lease by tid
router.get('/transaction/:tid',
[
  check('tid')
    .not().isEmpty()
    .isLength({
      min: 44,
      max: 44
    })
],
validateInput,
async function (req, res, next) {
  try {
    const getLeases = await db('transactions')
    .select()
    .where('id', req.params.tid)

    res.status(200).json(getLeases)
  } catch (err) {
    next(err)
  }
})

module.exports = router
