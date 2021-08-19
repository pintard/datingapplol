const bcrypt = require('bcrypt')
const pool = require('./PgPool')

const insertUser = async ({ address, repeatPassword, ...user }) => {
    try {
        const interestMap = {
            men: ['man'],
            women: ['woman'],
            others: ['other'],
            everyone: ['man', 'woman', 'other']
        }
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
        /** Stringify user property values for storage */
        const interestValues = interestMap[user.interest].map(x => format(x))
        /** Insert to coordinate table with address table association */
        await pool.query(`INSERT INTO coordinate_table (${coordKeys})
            VALUES (${coordValues})`)
        /** Insert to address table with user table association */
        await pool.query(`INSERT INTO address_table (value)
            VALUES ('${address.value}')`)
        /** Insert to main user table */
        await pool.query(`INSERT INTO user_table (${userKeys})
            VALUES (${userValues})`)
        /** Queries all existing users that match the 5 given properties */
        const matches = await pool.query(
            `SELECT a.username, b.value as address, a.age, a.gender,
                    a.hobbies, a.outgoing, a.pets
                FROM
                    user_table a, address_table b
                WHERE
                    a.id=b.id
                    AND age BETWEEN ${user.range[0]} and ${user.range[1]}
                    AND gender in (${interestValues})
                    AND hobbies='${user.hobbies}'
                    AND outgoing='${user.outgoing}'
                    AND pets='${user.pets}'`
        )
        console.log('user', user)
        console.table(matches.rows.length > 0 ? matches.rows : '')
        return matches.rows || []
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