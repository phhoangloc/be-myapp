const mongoose = require('mongoose')
const Schema = mongoose.Schema

const cartSchema = Schema({
    process: {
        type: String,
        enum: {
            values: ['add', 'cancel', 'request', 'refuse', 'accept', 'pay', 'send', 'received', 'return', 'finish'],
            message: '{VALUE} is not supported'
        },
        default: 'add',
    },
    borrower: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    lender: {
        type: Schema.Types.ObjectId,
        ref: "user",
        require: true,
        validate: {
            validator: function (v) {
                return (this.borrower.toString() !== v.toString())
            },
            message: "borrower and lender is not the same"
        },
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: "book",
        require: true,
        unique: true
    }],
    dateRequest: {
        type: Date,
        default: Date.now,
    },
    dateReceived: {
        type: Date,
        default: null,
    },
    dateReturn: {
        type: Date,
        default: null,
    },
    dateFinish: {
        type: Date,
        default: null,
    }
})

module.exports = mongoose.model('carts', cartSchema);
