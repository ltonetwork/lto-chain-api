// Copyright (c) 2018-2019, BB Jansen
//
// Please see the included LICENSE file for more information.
'use strict'

const db = require('../utils/utils').knex

async function verifyToken (req, res, next) {
  try {
    const getToken = await db('tokens')
      .select('id')
      .where('id', req.token.jti)
      .limit(1)

    // Validate Token
    if (getToken && getToken.length <= 0) {
      res.status(401, 'Invalid Access Token.')
    }

    if (getToken[0].revoked === true) {
      res.status(401, 'Access Token Revoked.')
    }

    if (getToken[0].deleted === true) {
      res.status(401, 'Invalid Access Token.')
    }

    // Validate Issuer
    //    if(req.token.aud != req.headers.host) {
    //        throw('jwt audience mismatch')
    //    }

    // validate Audience
    if (req.token.iss !== process.env.APP_ISSUER) {
      res.status(401, 'Access Token Mismatch.')
    }

    // Validate Host
    //    if(getApp[0].domain != req.host) {
    //        throw('jwt host mismatch')
    //    }

    // Validate IP
    if (getApp[0].ipAddress !== req.headers['x-real-ip']) {
      res.status(401, 'Access Token IP Mismatch.')
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = verifyToken
