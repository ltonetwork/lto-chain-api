// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex
const moment = require('moment')

// Get all peers
router.get('/all', async function (req, res, next) {
  try {
    const getPeers = await db('peers')
      .leftJoin('addresses', 'peers.generator', 'addresses.address')
      .select('peers.*', 'addresses.label', 'addresses.url')

    res.status(200).json(getPeers)
  } catch (err) {
    next(err)
  }
})

// Get peer by address
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
      const getPeers = await db('peers')
        .leftJoin('addresses', 'peers.generator', 'addresses.address')
        .select('peers.*', 'addresses.label', 'addresses.url')
        .where('peers.address', req.params.address)

      res.status(200).json(getPeers)
    } catch (err) {
      next(err)
    }
  })

// Get peer by period

router.get('/last/:period',
  [
    check('period')
      .not().isEmpty()
  ],
  validateInput,
  async function (req, res, next) {
    try {
      let range

      if (req.params.period === 'hour') {
        range = 'hour'
      } else if (req.params.period === 'day') {
        range = 'days'
      } else if (req.params.period === 'week') {
        range = 'week'
      } else if (req.params.period === 'month') {
        range = 'month'
      } else if (req.params.period === 'year') {
        range = 'year'
      }

      const getPeers = await db('peers')
        .leftJoin('addresses', 'peers.generator', 'addresses.address')
        .select('peers.*', 'addresses.label', 'addresses.url')
        .whereBetween('peers.updated', [moment().subtract(1, range).format('YYYY-MM-DD HH:mm:ss'), moment().format('YYYY-MM-DD HH:mm:ss')])

      res.status(200).json(getPeers)
    } catch (err) {
      next(err)
    }
  })

module.exports = router
