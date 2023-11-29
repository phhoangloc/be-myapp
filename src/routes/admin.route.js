const express = require("express")
const { viewAllUser, viewBook, viewBlog } = require("../controller/get.controller")
const { deleteUser, deleteBook, deleteBlog } = require("../controller/delete.controller")
const { createBook, createBlog } = require('../controller/post.controller')
const { updateBook } = require('../controller/put.controller')
const app = express()

//user
app.get('/users', viewAllUser)
app.delete('/users/:id', deleteUser)

//book
app.get('/books', viewBook)
app.post('/books/', createBook)
app.put('/books/:id', updateBook)
app.delete('/books/:id', deleteBook)

app.get('/blogs', viewBlog)
app.delete('/blogs/:id', deleteBlog)

module.exports = app
