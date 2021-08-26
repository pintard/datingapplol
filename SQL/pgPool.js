const Pool = require('pg').Pool

/** Production environment variables, preloaded by heroku */
const productionConfig = { connectionString: process.env.DATABASE_URL }
/** Development environment variables specified in dotenv */
const developmentConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
}

/** The database pool to be exported */
module.exports = new Pool(process.env.NODE_ENV === 'production' ?
    productionConfig : developmentConfig)