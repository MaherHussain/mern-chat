const mongoose = require('mongoose')

const UsersSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, unique: false }
}, { timestamps: true })

const userModel = mongoose.model('User', UsersSchema)
module.exports = userModel