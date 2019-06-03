# LTO Chain Cache API
This node.js project is the frontend API for [LTO Chain Cache Collector](https://github.com/fexra/lto-chain-cache-collector). It allows you to query the database cache.

## Requirements
- Node.js v8+
- [knex.js](http://knexjs.org) supported database (pg, sqlite3, mysql, mysql2, oracle, mssql)
- NGINX / Apache
- [LTO Chain Cache Collector](https://github.com/fexra/lto-chain-cache-collector)

## API Routes
- `/block/`
- `/consensus/`
- `/feature/`
- `/proof/`
- `/transaction/`
- `/transfer/`
- `/anchor/`
- `/lease/`
- `/generator/`
- `/address/`
- `/peer/`
- `/stats/`

## .env example

```
APP_PORT=9000

DB_HOST=localhost
DB_PORT=3306
DB_USER=user
DB_PASS=pass
DB_NAME=db

```