const bookModel = require('../model/book.Model')
const userModel = require('../model/user.Model')

const deleteBook = async (req, res) => {

    const id = req.params.id
    const userId = res.id
    const outPut = {}
    const book = await bookModel.findOne({ "_id": id })
    const ownerId = book.owner._id
    if (ownerId.toString() === userId) {
        const user = await userModel.findOne({ "_id": userId })
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
                outPut.msg = "your account have been delete successfully"
                res.json(outPut)
            })
    } else {
        res.json("you re not book's owner, you cant delete this book")
    }

}

const deleteController = {
    deleteBook
}

module.exports = deleteController