if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const Express = require('express')
const App = Express()
const insertUser = require('./SQL/insert')
const selectUsers = require('./SQL/select')

const port = process.env.PORT
const build = `${__dirname}/client/build`

App.set('json spaces', 2)
App.use(Express.json())
App.use(Express.urlencoded({ extended: false }))
App.use(Express.static(build))

App.get('/', (request, response) =>
    response.sendFile(`${build}/index.html`))

App.route('/api/users')
    /** Gets a table of all users */
    .get(async (request, response) => response.send(await selectUsers()))
    /** Posts a user to the database and return list of matches */
    .post(async (request, response) => {
        const user = Object.assign(...Object.values(request.body))
        const matches = await insertUser(user)
        response.json(matches)
    })

App.route('/api/users/:id')
    .get((request, response) => { })
    .put((request, response) => { })
    .delete((request, response) => { })

App.listen(port, error => error ?
    console.log("\x1b[31mERROR:\x1b[0m", error) :
    console.log(`\x1b[35mConnected to \x1b[36mport: ${port}\x1b[0m`))