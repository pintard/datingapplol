if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const Express = require('express')
const App = Express()
const insertUser = require('./insert')

const port = process.env.PORT
const build = `${__dirname}/view/build`

App.set('json spaces', 2)
App.use(Express.json())
App.use(Express.urlencoded({ extended: false }))
App.use(Express.static(build))

App.get('/', (_, response) =>
    response.sendFile(`${build}/index.html`))

App.route('/api/users')
    .get((request, response) => { })
    .post((request, response) => {
        /** Flattens request body into single user object */
        const user = Object.assign(...Object.values(request.body))
        insertUser(user)
    })

App.route('/api/users/:id')
    .get((request, response) => { })
    .put((request, response) => { })
    .delete((request, response) => { })

App.listen(port, error => error ?
    console.log("\x1b[31mERROR:\x1b[0m", error) :
    console.log(`\x1b[35mConnected to \x1b[36mport: ${port}\x1b[0m`))