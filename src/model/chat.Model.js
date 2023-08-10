var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const chatSchema = Schema({
    name: {
        type: String,
    },
    member: [
        {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    ],
    content: [
        {
            notice: Boolean,
            username: String,
            mess: String,
            room: {
                type: Schema.Types.ObjectId,
                ref: "chat"
            },
            createDate: {
                type: Date,
                default: Date.now,
            },
        }
    ],

})
module.exports = mongoose.model('chat', chatSchema);
