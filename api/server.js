
const express = require('express');
const app = express()
const port = 3001
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const ws = require('ws')
const jwt = require('jsonwebtoken')
const messageSchema = require('./models/Message')

dotenv.config()
const jwtSecret = process.env.JWT_secret

const RigesterRoute = require('./routes/Register')
const ProfileRoute = require('./routes/Profile')
const LoginRoute = require('./routes/Login');
const LogoutRoute = require('./routes/Logout');
const MessagesRoute = require('./routes/Messages')
const UsersRoute = require('./routes/Users')



app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())

app.use('/register', RigesterRoute)
app.use('/profile', ProfileRoute)
app.use('/login', LoginRoute)
app.use('/logout', LogoutRoute)
app.use('/messages', MessagesRoute)
app.use('/users', UsersRoute)


const server = app.listen(port, () => {
    console.log(`This app listening on port ${port}`)
})

const wss = new ws.WebSocketServer({ server })
wss.on('connection', (connection, req) => {


    //notify online users
    function notifyAboutOnlineUsers() {

        [...wss.clients].forEach(client => {
            client.send(JSON.stringify(
                {
                    online: [...wss.clients].map(c => (
                        {
                            _id: c.userId,
                            username: c.username
                        })
                    )
                }
            ))
        })
    }
    connection.isAlive = true
    connection.timer = setInterval(() => {
        connection.ping()

        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false
            connection.terminate()
            notifyAboutOnlineUsers()
        }, 1000)
    }, 5000)

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer)
    })


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

    notifyAboutOnlineUsers()

    connection.on('message', async (message) => {
        const messageData = JSON.parse(message.toString())
        const { recipient, text } = messageData
        if (recipient && text) {
            const messageDoc = await messageSchema.create({
                sender: connection.userId,
                recipient,
                text,
            });
            [...wss.clients]
                .filter(u => u.userId === recipient)
                .forEach(c => c.send(JSON.stringify({
                    text,
                    sender: connection.userId,
                    recipient,
                    _id: messageDoc._id
                })))
        }
    });


})
