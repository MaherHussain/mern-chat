const express = require('express');
const app = express();
const dotenv = require('dotenv')
const mongoose = require('mongoose')

const userModel = require('../models/User')

const jwt = require('jsonwebtoken')

const router = express.Router()

dotenv.config()
mongoose.connect(process.env.mongodb_URI)

const jwtSecret = process.env.JWT_secret
router.get('/', (req, res) => {
    res.send('get is ok ')
})

router.post('/', async (req, res) => {
    const { email, username, password } = req.body


    try {
        const createdUser = await userModel.create({ email, username, password })
        jwt.sign({ userId: createdUser._id, username }, jwtSecret, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
            })
        })
    }
    catch (error) {
        throw error
    }


})

module.exports = router