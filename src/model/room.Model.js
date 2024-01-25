var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const RoomSchema = Schema({
    host: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },

    member: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],

    messages: [
        {
            type: Schema.Types.ObjectId,
            ref: "message"
        }
    ],



})
module.exports = mongoose.model('room', RoomSchema);