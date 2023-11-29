const bookModel = require('../model/book.Model')
const userModel = require('../model/user.Model')
const blogModel = require('../model/blog.Model')
const cartModel = require('../model/cart.Model')

const deleteBook = async (req, res) => {

    const id = req.params.id
    const userId = res.id
    const outPut = {}
    const book = await bookModel.findOne({ "_id": id })
    const admin = await userModel.findOne({ "_id": userId })
    const isAdmin = admin.position === "admin" ? true : false
    const ownerId = book.owner._id
    if (ownerId.toString() === userId || isAdmin) {
        const user = await userModel.findOne({ "_id": ownerId })
        const userBooks = user.books
        const newBooks = userBooks.filter(item => item._id != id)
        await userModel.updateOne({ "_id": userId }, { "books": newBooks })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.json(outPut)
                throw error.message
            })
        await bookModel.deleteOne({ "_id": id })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
                throw error.message
            }).then(() => {
                outPut.success = true
                outPut.msg = "your book have been delete successfully"
                res.json(outPut)
            })

    } else {
        res.json("you re not book's owner, you cant delete this book")
    }

}
const deleteBlog = async (req, res) => {

    const id = req.params.id
    const userId = res.id
    const outPut = {}
    const blog = await blogModel.findOne({ "_id": id })
    const admin = await userModel.findOne({ "_id": userId })
    const isAdmin = admin.position === "admin" ? true : false
    const authorId = blog.author._id
    if (authorId.toString() === userId || isAdmin) {
        const user = await userModel.findOne({ "_id": authorId })
        const userBooks = user.blogs
        const newBooks = userBooks.filter(item => item._id != id)
        await userModel.updateOne({ "_id": userId }, { "blogs": newBooks })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.json(outPut)
                throw error.message
            })
        await blogModel.deleteOne({ "_id": id })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
                throw error.message
            }).then(() => {
                outPut.success = true
                outPut.msg = "your blog have been delete successfully"
                res.json(outPut)
            })
    } else {
        res.json("you re not blog's author, you cant delete this blog")
    }

}

//admin
const deleteUser = async (req, res) => {
    const id = req.params.id
    const outPut = {}
    await userModel.deleteOne({ "_id": id })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "user have been delete successfully"
            res.json(outPut)
        })

}

const deleteCart = async (req, res) => {

    const id = req.params.id
    const userId = res.id
    const outPut = {}

    const user = await userModel.findOne({ "_id": userId })
    const newCarts = user && user.carts.filter

    const cart = await cartModel.d({ "_id": id })
    const authorId = blog.author._id
    if (authorId.toString() === userId) {
        const user = await userModel.findOne({ "_id": userId })
        const userBooks = user.blogs
        const newBooks = userBooks.filter(item => item._id != id)
        await userModel.updateOne({ "_id": userId }, { "blogs": newBooks })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.json(outPut)
                throw error.message
            })
        await blogModel.deleteOne({ "_id": id })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
                throw error.message
            }).then(() => {
                outPut.success = true
                outPut.msg = "your blog have been delete successfully"
                res.json(outPut)
            })
    } else {
        res.json("you re not blog's author, you cant delete this blog")
    }

}

const deleteController = {
    deleteBook,
    deleteBlog,
    deleteUser
}

module.exports = deleteController