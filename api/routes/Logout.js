const express = require('express');


const jwt = require('jsonwebtoken')


const router = express.Router()

router.get('/', (req, res) => {
    res.send('get logout is ok ')
})

router.post('/', (req, res) => {

    res.cookie('token', '', { sameSite: 'none', secure: true }).json({ status: 'logged out ' })
})
module.exports = router