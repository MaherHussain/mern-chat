
const express = require('express');
const app = express()
const port = 3001
const cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config()

const RigesterRoute = require('./routes/Register')
const ProfileRoute = require('./routes/Profile')
const LoginRoute = require('./routes/Login')

app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use(express.json())

app.use('/register', RigesterRoute)
app.use('/profile', ProfileRoute)
app.use('/login', LoginRoute)


app.listen(port, () => {
    console.log(`This app listening on port ${port}`)
})