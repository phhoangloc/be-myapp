const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'username cant be null'],
        minlength: [5, 'username minimum length 5 characters'],
        maxlength: [20, 'username maximum length 20 characters']
    },
    password: {
        type: String,
        required: [true, 'password cant be null']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    position: {
        type: String,
        enum: {
            values: ['admin', 'seller', 'user'],
            message: '{VALUE} is not supported'
        },
        default: 'user',
    },
    active: {
        type: Boolean,
        default: false
    },
    background: {
        type: String,
        default: null
    },
    app: [{
        name: String,
        icon: String,
        link: String
    }],
    books: [
        { type: Schema.Types.ObjectId, ref: "book" }
    ],
    borowedbooks: [
        { type: Schema.Types.ObjectId, ref: "book" }
    ],
    carts: [
        { type: Schema.Types.ObjectId, ref: "cart" }
    ],
    blogs: [
        { type: Schema.Types.ObjectId, ref: "blog" }
    ],
    infor: {
        fullname: String,
        avata: String,
        address: String,
        phone: String,
    },
    foot: {
        type: Number,
        default: 10,
    },
    notification: [{
        msg: String,
        seen: {
            type: Boolean,
            default: false
        }
    }],

})

module.exports = mongoose.model('user', userSchema)