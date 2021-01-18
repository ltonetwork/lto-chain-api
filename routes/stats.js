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
const axios = require('axios')

// Get total burned 
// Get generators stats (monthly)  from lto.tools
router.get('/burned/total',
validateInput,
async function (req, res, next) {
  try {
    const getTxBurn = await axios.get('https://lto.tools/balances/json')
    const getBridgeBurn = await axios.get('https://nodes.lto.network/addresses/balance/3JrGV6TeEV3ovVjsh9SPqQL48EDLET47B9U')
    const getContractBurn = await axios.get('https://bridge.lto.network/stats')

    const txBurn = 500000000 - getTxBurn.data.totalBalance
    const bridgeBurn = getBridgeBurn.data.balance / 100000000
    const contractBurn = getContractBurn.data.volume.lto20.burned

    const burned = txBurn + bridgeBurn + contractBurn

    res.status(200).json(burned)
  } catch (err) {
    next(err)
  }
})

router.get('/supply/total',
validateInput,
async function (req, res, next) {
  try {
    const getBurn = await axios.get('https://stats.ltonetwork.com/v1/stats/burned/total')

    const supply = 500000000 - getBurn.data

    res.status(200).json(supply)
  } catch (err) {
    next(err)
  }
})

router.get('/supply/circulating',
validateInput,
async function (req, res, next) {
  try {
    const getCirculating = await axios.get('https://bridge.lto.network/stats/circulating-supply')
    const getTxBurn = await axios.get('https://lto.tools/balances/json')

    const txBurn = 500000000 - getTxBurn.data.totalBalance

    const circulating = getCirculating.data -txBurn

    res.status(200).json(circulating)
  } catch (err) {
    next(err)
  }
})

router.get('/nodes/',
validateInput,
async function (req, res, next) {
  try {
    const getNodes = await axios.get('https://lto.tools/nodes/json')

    const nodes = getNodes.data

    res.status(200).json(nodes)
  } catch (err) {
    next(err)
  }

// Get transactions count between two dates
router.get('/transaction/:type/:start/:end',
[
  check('start').not().isEmpty(),
  check('end').not().isEmpty()
],
validateInput,
async function (req, res, next) {
  try {

    let type = req.params.type
    const start = moment(req.params.start, 'x')
    const end = moment(req.params.end, 'x')

    // Let's figure out the granularity
    let format
    const difference = moment(end).diff(moment(start), 'days')

    if (difference <= '1') { // Day granularity -> hour

      format = '%Y-%m-%d %H:00:00'
    }
    else if ((difference >= 1) && (difference <= 7)) { // Week granularity -> day

      format = '%Y-%m-%d 00:00:00'
    }
    else if ((difference > 7) && (difference <= 31))  { // Month granularity -> day
      
      format = '%Y-%m-%d 00:00:00'
    }
    else if ((difference > 31) && (difference <= 366))  { // Year granularity -> month
      
      format = '%Y-%m-00 00:00:00'
    }
    else { // Multiple Years early

      format = '%Y-%m-00 00:00:00'
    }


    let data

    if(type === 'all') {
      data = await db('transactions')
      .select(db.raw('date_format(from_unixtime(timestamp / 1000), "' + format + '") as period'))
      .count('id as count')
      .whereBetween('timestamp', [req.params.start, req.params.end])
      .groupByRaw('period')
    } else {
      data = await db('transactions')
      .select(db.raw('date_format(from_unixtime(timestamp / 1000), "' + format + '") as period'))
      .count('id as count')
      .where('type', type)
      .whereBetween('timestamp', [req.params.start, req.params.end])
      .groupByRaw('period')
    }

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

// Get transactions count between two dates
router.get('/transaction/total/:type',
async function (req, res, next) {
  try {

      let type = req.params.type


      let data

      if(type === 'all') {
        
        data = await db('transactions')
        .count('id as count')

      } else {

        data = await db('transactions')
        .count('id as count')
        .where('type', type)
      }

    res.status(200).json(data[0])
  } catch (err) {
    next(err)
  }
})

// Get transactions count between two dates
router.get('/transaction/:granularity/:type/:start/:end',
[
  check('start').not().isEmpty(),
  check('end').not().isEmpty()
],
validateInput,
async function (req, res, next) {
  try {

    const granularity = req.params.end
    let type = req.params.type
    const start = moment(req.params.start, 'x')
    const end = moment(req.params.end, 'x')
    
    // Let's figure out the range
    let format

    if (granularity === 'day') { // Day granularity

      format = '%Y-%m-%d 00:00:00'
    }
    else if ((granularity === 'month')) { // month granularity

      format = '%Y-%m-00 00:00:00'
    }
    else if ((granularity === 'year')) { // year granularity
      
      format = '%Y-00-00 00:00:00'
    }
    else { // Multiple Years early

      format = '%Y-%m-%d 00:00:00'
    }

    let data

    if(type === 'all') {
      data = await db('transactions')
      .select(db.raw('date_format(from_unixtime(timestamp / 1000), "' + format + '") as period'))
      .count('id as count')
      .whereBetween('timestamp', [req.params.start, req.params.end])
      .groupByRaw('period')
    } else {
      data = await db('transactions')
      .select(db.raw('date_format(from_unixtime(timestamp / 1000), "' + format + '") as period'))
      .count('id as count')
      .where('type', type)
      .whereBetween('timestamp', [req.params.start, req.params.end])
      .groupByRaw('period')
    }

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})


module.exports = router
