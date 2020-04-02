// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex

// Block last
router.get('/last', async function (req, res, next) {
  try {
    const getBlock = await db('blocks')
      .leftJoin('consensus', 'blocks.index', 'consensus.index')
    // .innerJoin('transactions', 'blocks.index', 'transactions.block')
      .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
      .orderBy('blocks.index', 'desc')
      .limit(1)

    res.status(200).json(getBlock[0])
  } catch (err) {
    console.log(err)
    next(err)
  }
})

router.get('/last/:amount',
  [
    check('amount')
      .not().isEmpty()
      .isInt({
        min: 1,
        max: 1000
      })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getBlocks = await db('blocks')
        .leftJoin('consensus', 'blocks.index', 'consensus.index')
      // .innerJoin('transactions', 'blocks.index', 'transactions.block')
        .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
        .orderBy('blocks.index', 'desc')
        .limit(req.params.amount)

      res.status(200).json(getBlocks)
    } catch (err) {
      console.log(err)
      next(err)
    }
  })

// Get block by generator address
router.get('/address/:address',
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
      const getBlock = await db('blocks')
        .leftJoin('consensus', 'blocks.index', 'consensus.index')
      // .innerJoin('transactions', 'blocks.index', 'transactions.block')
        .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
        .where('generator', req.params.address)
        .orderBy('blocks.index', 'desc')

      res.status(200).json(getBlock)
    } catch (err) {
      next(err)
    }
  })

// Block Range
router.get('/:start/:end',
  [
    check('start')
      .not().isEmpty()
      .isInt({
        min: 1
      }),

    check('end')
      .not().isEmpty()
      .isInt({
        min: 1
      })
  ],
  validateInput,
  async function (req, res, next) {
    try {
      const getBlocks = await db('blocks')
        .leftJoin('consensus', 'blocks.index', 'consensus.index')
      // .innerJoin('transactions', 'blocks.index', 'transactions.block')
        .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
        .whereBetween('blocks.index', [req.params.start, req.params.end])
        .orderBy('blocks.index', 'desc')
        .limit(1000)

      res.status(200).json(getBlocks)
    } catch (err) {
      next(err)
    }
  })

// Get unverified blocks
router.get('/unverified', async function (req, res, next) {
  try {
    const getBlocks = await db('blocks')
      .leftJoin('consensus', 'blocks.index', 'consensus.index')
    // .innerJoin('transactions', 'blocks.index', 'transactions.block')
      .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
      .whereRaw('blocks.datetime > NOW() - INTERVAL 90 MINUTE')
      .where('blocks.verified', false)
      .orderBy('blocks.index', 'desc')
      .limit(1000)

    res.status(200).json(getBlocks)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

// Block at index
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
      const getBlock = await db('blocks')
        .leftJoin('consensus', 'blocks.index', 'consensus.index')
      // .innerJoin('transactions', 'blocks.index', 'transactions.block')
        .select(db.raw('blocks.index, blocks.reference, blocks.generator, blocks.signature, blocks.size, blocks.count, blocks.fee, blocks.version, blocks.timestamp, blocks.verified, consensus.signature, consensus.target'))
        .where('blocks.index', req.params.index)
        .orderBy('blocks.index', 'desc')
        .limit(1)

      res.status(200).json(getBlock[0])
    } catch (err) {
      next(err)
    }
  })

module.exports = router
