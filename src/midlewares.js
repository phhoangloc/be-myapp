const jwt = require('jsonwebtoken')

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

const middlewares = {
    UserAuthen
}

module.exports = middlewares