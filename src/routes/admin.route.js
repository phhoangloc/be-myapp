const express = require("express")
const { viewAllUser, viewUser, viewBook, viewBlog } = require("../controller/get.controller")
const app = express()

app.get('/users', viewAllUser)
app.get('/user', viewUser)
app.get('/books', viewBook)
app.get('/blogs', viewBlog)

module.exports = app
