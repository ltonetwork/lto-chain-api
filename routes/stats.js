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


// Get transactions count between two dates
router.get('/transaction/:start/:end',
[
  check('start').not().isEmpty(),
  check('end').not().isEmpty()
],
validateInput,
async function (req, res, next) {
  try {

    const start = moment(req.params.start, 'x')
    const end = moment(req.params.end, 'x')

    // Let's figure out the range
    let format
    const difference = moment(end).diff(moment(start), 'days')

    if (difference <= '1') { // Day range -> hour

      format = '%Y-%m-%d %H:00:00'
    }
    else if ((difference >= 1) && (difference <= 7)) { // Week range -> day

      format = '%Y-%m-%d 00:00:00'
    }
    else if ((difference > 7) && (difference <= moment().daysInMonth()))  { // Month range -> day
      
      format = '%Y-%m-%d 00:00:00'
    }
    else if ((difference > moment().daysInMonth()) && (difference <= 366))  { // Year range -> month
      
      format = '%Y-%m-00 00:00:00'
    }
    else { // Multiple Years early

      format = '%Y-%m-00 00:00:00'
    }

    console.log(format)

    const data = await db('transactions')
    //.select(db.raw(range + '(from_unixtime(timestamp / 1000)) as date'))
    .select(db.raw('date_format(from_unixtime(timestamp / 1000), "' + format + '") as period'))
    .count('id as count')
    .whereBetween('timestamp', [req.params.start, req.params.end])
    .groupByRaw('period')

    res.status(200).json(data)
  } catch (err) {
    next(err)
  }
})

module.exports = router
