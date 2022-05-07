const bcrypt = require('bcrypt')
const pool = require('./pgPool')

/**
 * Takes a user object to be inserted into the SQL database and queried against
 * the existing database elements matching it's properties. Returns the
 * available matches as an array of objects
 *
 * @param {Object} user - a dating app user object
 * @param {string} user.address - the string value of the user's address
 * @param {string} user.repeatPassword - the repeated password to be out filtered
 *
 * @returns {Array} an array of matches or an empty array
 */
const insertUser = async ({ address, repeatPassword, ...user }) => {
    try {
        const interestMap = {
            men: ['man'],
            women: ['woman'],
            others: ['other'],
            everyone: ['man', 'woman', 'other']
        }

        user.password = await bcrypt.hash(user.password, 10)

        const format = x => !isNaN(x) ? x : Array.isArray(x) ? `'{${x}}'` : `'${x}'`
        const coordKeys = Object.keys(address.coordinates).join(', ')
        const coordValues = Object.values(address.coordinates).map(x => format(x))
        const userKeys = Object.keys(user).join(', ')
        const userValues = Object.values(user).map(x => format(x))
        const interestValues = interestMap[user.interest].map(x => format(x))

        await pool.query(`INSERT INTO coordinate_table (${coordKeys}) VALUES (${coordValues})`)
        await pool.query(`INSERT INTO address_table (address) VALUES ('${address.value}')`)
        const result = await pool.query(`INSERT INTO user_table (${userKeys}) VALUES (${userValues}) RETURNING id`)

        const id = result.rows[0].id
        
        const matches = await pool.query(
            `SELECT a.username, b.value as address, a.age, a.gender, a.hobbies, a.outgoing, a.pets
                FROM user_table a, address_table b
                WHERE a.id != ${id}
                AND a.id = b.id
                AND age BETWEEN ${user.range[0]} and ${user.range[1]}
                AND gender in (${interestValues})
                AND hobbies = '${user.hobbies}'
                AND outgoing = '${user.outgoing}'
                AND pets = '${user.pets}'`
        )

        console.table(matches.rows.length > 0 ? matches.rows : [])
        return matches.rows || []
    } catch (error) { console.error(error) }
}

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

module.exports = insertUser