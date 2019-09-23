# LTO Chain Cache API
This node.js project is the frontend API for [LTO Chain Cache Collector](https://github.com/fexra/lto-chain-cache-collector). It allows you to query the database cache.

## Requirements
- Node.js v8+
- [knex.js](http://knexjs.org) supported database (pg, sqlite3, mysql, mysql2, oracle, mssql)
- NGINX / Apache
- [LTO Chain Cache Collector](https://github.com/fexra/lto-chain-cache-collector)

## API Routes
- `/v1/block/`
- `/v1/consensus/`
- `/v1/feature/`
- `/v1/proof/`
- `/v1/transaction/`
- `/v1/transfer/`
- `/v1/anchor/`
- `/v1/lease/`
- `/v1/generator/`
- `/v1/address/`
- `/v1/stats/`

## .env example
```
APP_PORT=9000
APP_SECRET=secret

DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASS=pass
DB_NAME=db

LIMIT_TOTAL=1000
LIMIT_EXPIRE=1000
```