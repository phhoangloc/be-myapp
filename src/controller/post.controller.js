const userModel = require('../model/user.Model')
const bookModel = require('../model/book.Model')
const bcryptjs = require('bcryptjs')
const transporter = require('../connects/email')
const jwt = require('jsonwebtoken');

var registercode

const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    registercode = Math.floor(Math.random() * (max - min + 1)) + min;
}

const outPut = {}

const createUser = async (req, res, next) => {
    const body = req.body
    if (parseInt(body.registercode) === parseInt(registercode)) {
        const salt = bcryptjs.genSaltSync(10);
        const mahoa_password = req.body.password && bcryptjs.hashSync(req.body.password.toString(), salt);
        body.password = mahoa_password
        userModel.create(body)
            .catch((error) => {
                outPut.success = false
                outPut.message = error.message
                res.json(outPut)
                throw error.message
            })
            .then(() => {
                next()
            })
    } else {
        outPut.success = false
        outPut.msg = "your code is not correct"
        res.json(outPut)
    }
}
const sendMailToRegister = (req, res) => {

    generateRandomCode()

    const mainOptions = {
        from: 'LOCKHEART (ph.hoangloc@gmail.com) <no-reply>',
        to: req.body.email,
        subject: 'Register An Account',
        html: `
        <p style="text-align:center">Hello<p>
        <p style="text-align:center">Please click <a style="font-weight:bold;color:green" href=${process.env.REACT_APP_URL}/register/${req.body.email}>here</a> to register account<p>
        <p style="text-align:center">Register Code <span style="font-weight:bold;color:green;font-size:25px">${registercode}</span><p>`
    }

    transporter.sendMail(mainOptions)
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.json(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "please check your email to register account"
            res.json(outPut)
        })
}
const sendMailToActive = (req, res) => {

    const mainOptions = {
        from: 'LOCKHEART (ph.hoangloc@gmail.com) <no-reply>',
        to: req.body.email,
        subject: 'Active your Account',
        html: `
        <p style="text-align:center">Thanks for you registering!<p>
        <p style="text-align:center">Please click <a style="font-weight:bold;color:green" href=${process.env.REACT_APP_URL}/active/${req.body.email}>here</a> to acctive your account<p>`
    }

    transporter.sendMail(mainOptions)
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "please check your email to active your account"
            res.json(outPut)
        })
}

const activeAccount = (req, res) => {
    userModel.updateOne({ "email": req.body.email }, { "active": true })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.json(outPut)
            throw error.message
        })
        .then(() => {
            outPut.success = true
            outPut.msg = "your account have been actived"
            res.json(outPut)
        })
}

const login = async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const usenameiExsited = await userModel.findOne({ 'username': username })

    if (usenameiExsited == null) {

        result = {
            success: false,
            message: "account is not existed",
            data: []
        }

        res.json(result)

    } else {
        if (usenameiExsited.active == false) {

            result = {
                success: false,
                message: "account is not actived",
                data: []
            }

            res.json(result)

        } else {
            const isPasswordValid = await bcryptjs.compare(password, usenameiExsited.password);
            if (isPasswordValid) {

                const payload = { id: usenameiExsited._id }

                const token = jwt.sign(payload, process.env.SECRETTOKEN, { expiresIn: '24h' });


                result = {
                    success: true,
                    message: "login success!",
                    data: { token: token },
                }

                res.json(result)


            } else {
                result = {
                    success: false,
                    message: "password is not correct",
                    data: []
                }

                res.json(result)
            }
        }
    }
}

const createBook = async (req, res) => {
    const userId = res.id
    const body = req.body
    body.owner = userId
    const newbook = await bookModel.create(body)
    const user = await userModel.findOne({ "_id": userId })
    const userBooks = user.books
    const newBooks = [...userBooks, newbook._id]
    await userModel.updateOne({ "_id": userId }, { "books": newBooks })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "your book have been created"
            res.json(outPut)
        })
}

const postController = {
    createUser,
    sendMailToRegister,
    sendMailToActive,
    activeAccount,
    login,

    createBook
}
module.exports = postController