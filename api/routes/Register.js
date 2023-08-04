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
router.get('/', (req, res) => {
    res.send('get is ok ')
})

router.post('/', async (req, res) => {
    const salt = bcrypt.genSaltSync(10);
    const { email, username, password } = req.body

    try {
        const hashedPasword = bcrypt.hashSync(password, salt)
        const createdUser = await userModel.create({
            email: email,
            username: username,
            password: hashedPasword
        })
        jwt.sign({ userId: createdUser._id, username, email }, jwtSecret, {}, (err, token) => {
            if (err) throw err
            res.cookie('token', token, { sameSite: 'none', secure: true }).status(201).json({
                id: createdUser._id,
                username: createdUser.username
            })
        })
    }
    catch (error) {
        throw error
    }


})

module.exports = router