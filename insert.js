const Pool = require('pg').Pool
const bcrypt = require('bcrypt')

const insertUser = async ({ address, repeatPassword, ...user }) => {
    const pool = new Pool({
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT
    })

    try {
        /** Store hashed pwd in user query insert */
        user.password = await bcrypt.hash(user.password, 10)
        /** Format given value based on data type */
        const format = x => !isNaN(x) ? x : Array.isArray(x) ? `'{${x}}'` : `'${x}'`
        /** Coordinate property keys for coord table column type */
        const coordKeys = Object.keys(address.coordinates).join(', ')
        /** Stringify coordinates for storage */
        const coordValues = Object.values(address.coordinates).map(x => format(x))
        /** User property keys for user table column type */
        const userKeys = Object.keys(user).join(', ')
        /** Stringify user property values for storage */
        const userValues = Object.values(user).map(x => format(x))

        const coordResults = await pool.query(
            `INSERT INTO coordinate_table (${coordKeys})
                VALUES (${coordValues})`
        )

        const addressResults = await pool.query(
            `INSERT INTO address_table (value)
                VALUES ('${address.value}')`
        )

        const userResults = await pool.query(
            `INSERT INTO user_table (${userKeys})
                VALUES (${userValues})`
        )

        // const matches = await pool.query(
        //     `SELECT * FROM user_table `
        // )

        console.log(user)
        // response.json()
    } catch (error) { console.error(error) }
}

module.exports = insertUser

/**
 * Takes two coordinates and calculates the straight line trajectory using
 * a haversine programmatic variant
 *
 * @param {Object} coord0 - the initial coordinate
 * @param {Object} coord - the terminal coordinate
 * @returns {number} the total distance between points a and b in mi
 */
const calcDistance = (
    { latitude: lat0, longitude: long0 },
    { latitude: lat, longitude: long }
) => {
    const toRadians = val => val * Math.PI / 180
    const radius = 3959 // earth's radius (mi)
    const deltaLat = toRadians(lat - lat0)
    const deltaLong = toRadians(long - long0)
    const x = Math.sin(deltaLat / 2)
        * Math.sin(deltaLat / 2)
        + Math.sin(deltaLong / 2)
        * Math.sin(deltaLong / 2)
        * Math.cos(toRadians(lat0))
        * Math.cos(toRadians(lat))
    return radius * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))
}