const { Double } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    source: { type: String},
    dest: { type: String},
    action: { type: String},
    time: {type: Date ,default: Date.now},
    amount: {type: Number, default:0 }
})

module.exports = mongoose.model('transactions', userSchema);