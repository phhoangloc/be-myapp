const userModel = require('../model/user.Model')
const bookModel = require('../model/book.Model')
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
const updateBook = async (req, res) => {
    const id = req.params.id
    const userId = res.id
    const body = req.body
    const outPut = {}
    const book = await bookModel.findOne({ "_id": id })
    const ownerId = book.owner._id
    if (ownerId.toString() === userId) {
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
const putController = {
    updateUser,
    updateBook
}

module.exports = putController
