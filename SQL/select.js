const ejs = require('ejs')
const pool = require('./pgPool')

/**
 * Selects all public friendly representations of existing users
 * from SQL database
 *
 * @returns {string} the html templated string to be rendered by
 * the server
 */
const selectUsers = async () => {
    try {
        const users = await pool.query(
            `SELECT a.username, b.value as address, a.age, a.gender, a.hobbies, a.outgoing, a.pets
                FROM user_table a, address_table b
                WHERE a.id = b.id`
        )

        console.table(users.rows)

        return ejs.render(
            `<table>
                <tr>
                    <th>username</th>
                    <th>address</th>
                    <th>age</th>
                    <th>gender</th>
                    <th>hobbies</th>
                    <th>outgoing</th>
                    <th>pets</th>
                </tr>
                <% for (let i = 0; i < users.length; i++) { %>
                    <tr>
                        <td><%= users[i].username %></td>
                        <td><%= users[i].address %></td>
                        <td><%= users[i].age %></td>
                        <td><%= users[i].gender %></td>
                        <td><%= users[i].hobbies %></td>
                        <td><%= users[i].outgoing %></td>
                        <td><%= users[i].pets %></td>
                    </tr>
                <% } %>
            </table>`,
            { users: users.rows }
        )
    } catch (error) { console.error(error) }
}

module.exports = selectUsers