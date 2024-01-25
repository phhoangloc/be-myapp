var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const MessageSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },

    room: {
        type: Schema.Types.ObjectId,
        ref: "room"
    },
    msg: {
        type: String
    }


})
module.exports = mongoose.model('message', MessageSchema);