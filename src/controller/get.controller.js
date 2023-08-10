const bookModel = require('../model/book.Model')
const userModel = require('../model/user.Model')

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
        .findOne({ "_id": id })
        .sort(query.sort ? query.sort : {})
        .limit(query.limit ? query.limit : {})
        .populate("books", "name")
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

const viewController = {
    viewBook,
    viewUser,
    viewUserExist
}

module.exports = viewController