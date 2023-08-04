const express = require('express');

const jwt = require('jsonwebtoken')
const router = express.Router()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const jwtSecret = process.env.JWT_secret


dotenv.config()
mongoose.connect(process.env.mongodb_URI)

router.get('/', (req, res) => {
    const token = req.cookies?.token;
    if (token) {
        jwt.verify(token, jwtSecret, {}, (error, userData) => {
            if (error) throw error;

            res.json({ userData })
        })
    } else {
        res.status(401).json({ status: 401 })
    }

})
module.exports = router