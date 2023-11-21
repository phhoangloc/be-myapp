var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const blogSchema = Schema({
    genre: {
        type: String,
        default: "blog",
    },
    cover: {
        type: String,
        default: null,
    },
    title: {
        type: String,
        require: true,
        unique: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user"
    },
    slug: {
        type: String,
        require: true,
        unique: true,
    },
    detail: {
        type: String,
        require: true,
    },
    createDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('blog', blogSchema);