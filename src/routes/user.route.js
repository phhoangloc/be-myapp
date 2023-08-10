const express = require("express")
const app = express()
const deleteController = require("../controller/delete.controller")
const putController = require("../controller/put.controller")
const postController = require("../controller/post.controller")
const getController = require("../controller/get.controller")
const middlewares = require("../midlewares")

//userExist
app.get('/userexist', getController.viewUserExist)
//send mail to register
app.post('/sendmail', postController.sendMailToRegister)
// signup
app.post('/signup', postController.createUser, postController.sendMailToActive)
//acctive account
app.post('/activecccount', postController.activeAccount)
//login
app.post('/login', postController.login)

//middeware User
//viewUser
app.get('/user', middlewares.UserAuthen, getController.viewUser)
//update User
app.put('/user/:id', middlewares.UserAuthen, putController.updateUser)
//create book
app.post('/user/book/', middlewares.UserAuthen, postController.createBook)
//update Book
app.put('/user/book/:id', middlewares.UserAuthen, putController.updateBook)
//delete Book
app.delete('/user/book/:id', middlewares.UserAuthen, deleteController.deleteBook)




module.exports = app