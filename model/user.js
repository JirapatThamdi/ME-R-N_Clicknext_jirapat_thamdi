const { Double } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    f_name: { type: String, default: null},
    l_name: { type: String, default: null},
    email: { type: String, unique: true},
    password: {type: String},
    account: {type: String},
    token: {type: String},
    balance: {type: Number, default:0}
})

module.exports = mongoose.model('users', userSchema);