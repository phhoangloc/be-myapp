const bookModel = require('../model/book.Model')
const userModel = require('../model/user.Model')
const blogModel = require("../model/blog.Model")
const path = require('path')
const viewBook = async (req, res) => {

    const query = req.query

    const outPut = {}

    await bookModel.find({})
        .find(query.id ? { "_id": query.id } : {})
        .find(query.img ? { "img": query.img } : {})
        .find(query.name ? { "name": query.name } : {})
        .find(query.search ? { "name": { $regex: query.search } } : {})
        .find(query.author ? { "author": query.author } : {})
        .find(query.slug ? { "slug": query.slug } : {})
        .sort(query.sort ? query.sort : {})
        .limit(query.limit ? query.limit : {})
        .populate("owner", "username")
        .exec()
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            data.length ? outPut.success = true : outPut.success = false
            outPut.data = data.filter(item => query.owner ? item.owner.username === query.owner : item)
            res.json(outPut)
        })

}
const viewUser = async (req, res) => {

    const id = res.id
    const query = req.query
    const outPut = {}
    await userModel
        .findOne({ "_id": id }, "username email position active infor")
        .populate("books")
        .populate("blogs")
        .populate({
            path: "carts",
            populate: { select: "username", path: "borrower" },
        })
        .populate({
            path: "carts",
            populate: { select: "username", path: "lender" },
        })
        .populate({
            path: "carts",
            populate: { select: "name", path: "books" },
        })
        .exec()
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })

}

//admin
const viewAllUser = async (req, res) => {
    const outPut = {}
    const query = req.query
    await userModel
        .find({})
        .find(query.search ? { "username": { $regex: query.search } } : {})
        .sort(query.sort ? query.sort : {})
        .limit(query.limit ? query.limit : {})
        .populate("books")
        .populate("blogs")
        .populate({
            path: "carts",
            populate: { select: "username", path: "borrower" },
        })
        .populate({
            path: "carts",
            populate: { select: "username", path: "lender" },
        })
        .populate({
            path: "carts",
            populate: { select: "name", path: "books" },
        })
        .exec()
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })

}
const viewBlog = async (req, res) => {
    const query = req.query

    const outPut = {}

    await blogModel.find({})
        .find(query.id ? { "_id": query.id } : {})
        .find(query.title ? { "name": query.title } : {})
        .find(query.search ? { "title": { $regex: query.search } } : {})
        .find(query.author ? { "author": query.author } : {})
        .find(query.slug ? { "slug": query.slug } : {})
        .sort(query.sort ? query.sort : {})
        .limit(query.limit ? query.limit : {})
        .populate("author", "username")
        .exec()
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            data.length ? outPut.success = true : outPut.success = false
            outPut.data = data.filter(item => query.owner ? item.owner.username === query.owner : item)
            res.json(outPut)
        })

}
const viewUserExist = async (req, res) => {
    const query = req.query
    const outPut = {}
    await userModel
        .findOne(query.username && { "username": query.username })
        .findOne(query.email && { "email": query.email })
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            data ? outPut.success = true : outPut.success = false
            res.json(outPut)
        })
}
const viewCart = async (req, res) => {
    const id = res.id

    const outPut = {}

    await userModel.findOne({ "_id": id }, "carts")
        .populate("carts")
        .populate(
            {
                path: "carts",
                populate: { path: "borrower", select: "username" }
            }
        )
        .populate(
            {
                path: "carts",
                populate: { path: "lender", select: "username" }
            }
        )
        .populate(
            {
                path: "carts",
                populate: { path: "books", select: "name" }
            }
        )
        .exec()
        .catch((error) => {
            outPut.success = false
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            outPut.success = true
            outPut.data = data
            res.json(outPut)
        })
}


const viewController = {
    viewBook,
    viewUser,
    viewUserExist,
    viewBlog,
    viewCart,
    //admin,
    viewAllUser,
}

module.exports = viewController