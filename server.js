if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const express = require('express')
const app = express()

const insertUser = require('./SQL/insert')
const selectUsers = require('./SQL/select')

const port = process.env.PORT
const build = `${__dirname}/client/build`

app.set('json spaces', 2)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(build))

app.get('/', (req, res) => res.sendFile(`${build}/index.html`))

app.route('/api/users')
    .get(async (req, res) => res.send(await selectUsers()))
    .post(async (req, res) => {
        const user = Object.assign(...Object.values(req.body))
        const matches = await insertUser(user)
        res.json(matches)
    })

app.listen(port, error => error ?
    console.log("\x1b[31mERROR:\x1b[0m", error) :
    console.log(`\x1b[35mConnected to \x1b[36mport: ${port}\x1b[0m`))