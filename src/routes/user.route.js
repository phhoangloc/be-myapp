const express = require("express")
const app = express()
const deleteController = require("../controller/delete.controller")
const putController = require("../controller/put.controller")
const postController = require("../controller/post.controller")
const getController = require("../controller/get.controller")
const middlewares = require("../midleware/midlewares")
const viewController = require("../controller/get.controller")

//userExist
app.get('/userexist', getController.viewUserExist)
//acctive account
app.get('/active/:email', postController.activeAccount)
//send mail to register
app.post('/sendmail', postController.sendMailToRegister)
//send mail to acctive account
app.post('/sendmailtoacctive', postController.sendMailToActive)
// signup
app.post('/signup', postController.createUser, postController.sendMailToActive)
//login
app.post('/login', postController.login)

//middeware User 
//viewUser
app.get('/user', middlewares.UserAuthen, getController.viewUser)
//update User update avata
app.post('/user/avata', middlewares.UserAuthen, postController.UploadAvata)
//update User
app.put('/user/:id', middlewares.UserAuthen, putController.updateUser)

//create blog
app.post('/user/blog/', middlewares.UserAuthen, postController.createBlog)
//upload Blog Cover
app.post('/user/blog/cover', middlewares.UserAuthen, postController.UploadBlogCover)
//update Blog
app.put('/user/blog/:id', middlewares.UserAuthen, putController.updateBlog)
//delete Blog
app.delete('/user/blog/:id', middlewares.UserAuthen, deleteController.deleteBlog)


//view cart
app.get('/user/cart', middlewares.UserAuthen, viewController.viewCart)
//create cart
app.post('/user/cart/:bookid', middlewares.UserAuthen, postController.createCart)
module.exports = app
//view cart
app.put('/user/cart/:id', middlewares.UserAuthen, putController.updateCart)