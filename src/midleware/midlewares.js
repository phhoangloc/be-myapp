const jwt = require('jsonwebtoken')
const userModel = require('../model/user.Model')

const UserAuthen = (req, res, next) => {
    const authorization = req.headers['authorization']
    const token = authorization && authorization.split(" ")[1]
    if (token) {
        jwt.verify(token, process.env.SECRETTOKEN, (err, result) => {
            if (err) {
                res.json({
                    success: false,
                    msg: "you dont have permission"
                })
            } else {
                res.id = result.id
                next()
            }
        })
    } else {
        res.json({
            success: false,
            msg: "you dont log in"
        })
    }
}

const AdminAuthen = async (req, res, next) => {
    const outPut = {}
    await userModel.findOne({ "_id": res.id })
        .exec()
        .catch((error) => {
            outPut.success = false
            outPut.message = "you dont have permission"
            res.send(outPut)
            throw error.message
        })
        .then(data => {
            const position = data.position
            if (position == "admin") {
                outPut.success = true
                res.id = data._id
                next()
            } else {
                outPut.success = false
                outPut.message = "you dont have permission"
                res.json(outPut)
            }

        })
}



const middlewares = {
    UserAuthen,
    AdminAuthen

}

module.exports = middlewares