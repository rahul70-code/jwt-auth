const mongoose = require('mongoose');
const User = require('./user')

const accessTokenSchema = mongoose.Schema({
    token: {
        type: String
    },
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    userId: {
        type: String
    }
    
});

module.exports = mongoose.model('accessToken', accessTokenSchema);