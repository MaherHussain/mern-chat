const express = require('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const MessageModel = require('../models/Message')
const jwt = require('jsonwebtoken');
const { json } = require('express');

const router = express.Router()

dotenv.config()
mongoose.connect(process.env.mongodb_URI)
const jwtSecret = process.env.JWT_secret

async function getUserDataFromRequest(req) {
    return new Promise((resolve, reject) => {
        const token = req.cookies?.token;
        if (token) {
            jwt.verify(token, jwtSecret, {}, (err, userData) => {
                if (err) throw err;
                resolve(userData);
            });
        } else {
            reject('no token');
        }
    });

}

router.get('/', (req, res) => {
    res.send('get message is ok ')
})
router.get('/:userId', async (req, res) => {
    const { userId } = req.params

    let loggedInUser = await getUserDataFromRequest(req)
    const loggedInUserId = loggedInUser.userId
    try {
        const messages = await MessageModel.find({
            sender: { $in: [userId, loggedInUserId] },
            recipient: { $in: [userId, loggedInUserId] },
        }).sort({ createdAt: 1 });
        res.json(messages)
    } catch (error) {
        console.log(error)
    }

})
module.exports = router