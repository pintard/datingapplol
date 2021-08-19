const Pool = require('pg').Pool

const productionConfig = { connectionString: process.env.DATABASE_URL }
const developmentConfig = {
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT
}

module.exports = new Pool(process.env.NODE_ENV === 'production' ?
    productionConfig : developmentConfig)