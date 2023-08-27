const express = require('express');

const mongoose = require('mongoose')

const userModel = require('../models/User')

const jwt = require('jsonwebtoken')

const router = express.Router()

router.get('/', async (req, res) => {
    const users = await userModel.find({}, { _id: 1, username: 1 })
    res.json(users)

})
module.exports = router