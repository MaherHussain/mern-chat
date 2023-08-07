
const express = require('express');
const app = express()
const port = 3001
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const ws = require('ws')
const jwt = require('jsonwebtoken')


dotenv.config()
const jwtSecret = process.env.JWT_secret

const RigesterRoute = require('./routes/Register')
const ProfileRoute = require('./routes/Profile')
const LoginRoute = require('./routes/Login');
const { connection } = require('mongoose');
const e = require('express');

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())

app.use('/register', RigesterRoute)
app.use('/profile', ProfileRoute)
app.use('/login', LoginRoute)


const server = app.listen(port, () => {
    console.log(`This app listening on port ${port}`)
})

const wss = new ws.WebSocketServer({ server })
wss.on('connection', (connection, req) => {
    const cookies = req.headers.cookie
    if (cookies) {
        const tokenCookieString = cookies.split(';').find(str => str.startsWith('token='))

        if (tokenCookieString) {
            const tokenValue = tokenCookieString.split('=')[1]
            if (tokenValue) {
                jwt.verify(tokenValue, jwtSecret, {}, (error, userData) => {
                    if (error) throw error

                    const { userId, username } = userData
                    connection.userId = userId;
                    connection.username = username;

                })
            }
        }
    }
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify(
            {
                online: [...wss.clients].map(c => ({
                    id: c.userId,
                    username: c.username
                })
                )
            }
        ))
    })
})