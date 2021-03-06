// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')
const validateInput = require('../middleware/validateInput')
const db = require('../utils/utils').knex
const axios = require('axios')

// Get generators stats total
router.get('/all', async function (req, res, next) {
  try {
    const generators = await db('blocks')
      .leftJoin('addresses', 'blocks.generator', 'addresses.address')
      .select('blocks.generator', 'addresses.generating as pool', 'addresses.label', 'addresses.url')
      .count('blocks.index as blocks')
      .sum('blocks.fee as earnings')
      .groupBy('blocks.generator')
      .orderBy('blocks', 'desc')

    let total = generators.reduce((blocks, generator, index, generators) => {
      return blocks += generator.blocks
    }, 0)

    generators.forEach(generator => {
      generator.share = +(generator.blocks / total).toFixed(5) || 0
    })

    res.status(200).json(generators)
  } catch (err) {
    next(err)
  }
})

// Get generators stats (day)
router.get('/all/:start/:end',
[
  check('start').not().isEmpty(),
  check('end').not().isEmpty(),

],
validateInput,
async function (req, res, next) {
  try {

    const generators = await db('blocks')
      .leftJoin('addresses', 'blocks.generator', 'addresses.address')
      .select('blocks.generator', 'addresses.generating as pool', 'addresses.label', 'addresses.url')
      .count('blocks.index as blocks')
      .sum('blocks.fee as earnings')
      .whereBetween('blocks.timestamp', [req.params.start, req.params.end])
      .groupBy('blocks.generator')
      .orderBy('blocks', 'desc')

    let total = generators.reduce((blocks, generator, index, generators) => {
      return blocks += generator.blocks
    }, 0)

    generators.forEach(generator => {
      generator.share = +((generator.blocks / total) * 100).toFixed(5) || 0
    })

    res.status(200).json(generators)
  } catch (err) {
    next(err)
  }
})


// Get generators stats (weekly)  from lto.tools
router.get('/staking/weekly',
validateInput,
async function (req, res, next) {
  try {
    const staking = await axios.get('https://lto.tools/generators-weekly/json')

    res.status(200).json(staking.data)
  } catch (err) {
    next(err)
  }
})


// Get generators stats (monthly)  from lto.tools
router.get('/staking/monthly',
validateInput,
async function (req, res, next) {
  try {
    const staking = await axios.get('https://lto.tools/generators-monthly/json')

    res.status(200).json(staking.data)
  } catch (err) {
    next(err)
  }
})


module.exports = router
