var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const bookSchema = Schema({
    genre: {
        type: String,
        default: "book",
    },
    img: {
        type: String,
        require: true,
    },
    pdf: {
        type: String
    },
    name: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    slug: {
        type: String,
        require: true,
        unique: true,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    borrower: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    detail: {
        type: String,
        require: true,
    },

    slogan: {
        type: String,
        require: true,
    },

    createDate: {
        type: Date,
        default: Date.now,
    },


});
module.exports = mongoose.model('book', bookSchema);
