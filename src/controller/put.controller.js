const userModel = require('../model/user.Model')
const bookModel = require('../model/book.Model')
const blogModel = require('../model/blog.Model')
const cartModel = require('../model/cart.Model')
const updateUser = (req, res) => {
    const id = res.id
    const body = req.body
    const outPut = {}

    userModel.updateOne({ "_id": id }, body)
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "your account have been updated successfully"
            res.json(outPut)
        })
}
const updateUserByAdmin = (req, res) => {
    const id = req.params.id
    const body = req.body
    const outPut = {}

    userModel.updateOne({ "_id": id }, body)
        .catch((error) => {
            outPut.success = false
            outPut.message = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.message = "updated successfully"
            res.json(outPut)
        })
}
const updateBook = async (req, res) => {
    const id = req.params.id
    const userId = res.id
    const body = req.body
    const outPut = {}
    const book = await bookModel.findOne({ "_id": id })
    const admin = await userModel.findOne({ "_id": userId })
    const isAdmin = admin.position === "admin" ? true : false
    const ownerId = book.owner._id
    if (ownerId.toString() === userId || isAdmin) {
        bookModel.updateOne({ "_id": id }, body)
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
                throw error.message
            }).then(() => {
                outPut.success = true
                outPut.msg = "your book have been updated successfully"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        res.json("you re not book's owner, you cant update this book")
    }
}
const updateBlog = async (req, res) => {
    const id = req.params.id
    const userId = res.id
    const body = req.body
    const outPut = {}
    const blog = await blogModel.findOne({ "_id": id })
    const admin = await userModel.findOne({ "_id": userId })
    const isAdmin = admin.position === "admin" ? true : false
    const authorId = blog.author._id
    if (authorId.toString() === userId || isAdmin) {
        blogModel.updateOne({ "_id": id }, body)
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
                throw error.message
            }).then(() => {
                outPut.success = true
                outPut.msg = "your blog have been updated successfully"
                res.json(outPut)
            })
    } else {
        outPut.success = false
        res.json("you re not blog's author, you cant update this book")
    }
}
const updateCart = async (req, res) => {
    const outPut = {}

    const id = req.params.id
    const userId = res.id
    const carts = await userModel.findOne({ "_id": userId }, "carts").populate("carts")
    const cart = carts.carts.filter(item => item._id.toString() === id)
    const books = cart[0].books
    const newBooks = books.filter(item => item.toString() != req.body.bookid)
    await cartModel.updateOne({ "_id": id }, { books: newBooks })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "your cart have been updated successfully"
            res.json(outPut)
        })
}
const updateNoti = async (req, res) => {
    // res.send(res.id)
    const outPut = {}
    const userId = res.id
    const id = req.query.id
    const body = req.body

    const user = await userModel.findOne({ "_id": id }, "notifications")
    const notifications = user.notifications
    const noti = {
        msg: body.noti,
        from: body.from,
        type: body.type,
        seen: body.seen ? body.seen : false,
    }
    const newNoti = notifications.filter((item) => item.from.toString() !== body.from.toString())

    console.log(newNoti)

    await userModel.updateOne({ "_id": id }, { "notifications": [...newNoti, noti] })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "your cart have been updated successfully"
            res.json(outPut)
        })

}
const putController = {
    updateUser,
    updateUserByAdmin,
    updateBook,
    updateBlog,
    updateCart,
    updateNoti
}

module.exports = putController
