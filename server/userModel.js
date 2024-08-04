
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    MichaelHistory: {type: Array},
    FranklinHistory: {type: Array},
    TrevorHistory: {type: Array}
});

module.exports = mongoose.model('User', userSchema);
