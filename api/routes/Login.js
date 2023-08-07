const express = require('express');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const userModel = require('../models/User')

const jwt = require('jsonwebtoken')

const router = express.Router()

dotenv.config()
mongoose.connect(process.env.mongodb_URI)
const jwtSecret = process.env.JWT_secret

router.post('/', async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({ email })
    if (user) {
        const matchedPassword = bcrypt.compare(password, user.password)
        if (matchedPassword) {
            jwt.sign({ userId: user._id, email, username: user.username }, jwtSecret, {}, (err, token) => {
                if (err) throw err
                res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                    id: user._id,
                    username: user.username
                })
                res.redirect(`/user?${user.username}`)

            })
        }
    }


})
module.exports = router