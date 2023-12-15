const express = require("express")
const { viewAllUser, viewBook, viewBlog } = require("../controller/get.controller")
const { deleteUser, deleteBook, deleteBlog } = require("../controller/delete.controller")
const { createBook, createBlog, uploadFile } = require('../controller/post.controller')
const { updateBook, updateBlog, updateUserByAdmin } = require('../controller/put.controller')
const app = express()
//admin
app.post("/upload", uploadFile)

//user
app.get('/users', viewAllUser)
app.put('/users/:id', updateUserByAdmin)
app.delete('/users/:id', deleteUser)

//book
app.get('/books', viewBook)
app.post('/books/', createBook)
app.put('/books/:id', updateBook)
app.delete('/books/:id', deleteBook)

//blog
app.get('/blogs', viewBlog)
app.post('/blogs/', createBlog)
app.put('/blogs/:id', updateBlog)
app.delete('/blogs/:id', deleteBlog)

module.exports = app
