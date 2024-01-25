const userModel = require('../model/user.Model')
const bookModel = require('../model/book.Model')
const bcryptjs = require('bcryptjs')
const transporter = require('../connects/email')
const jwt = require('jsonwebtoken');
const blogModel = require('../model/blog.Model');
const cartModel = require('../model/cart.Model');
const roomModel = require("../model/room.Model")
const messageModel = require("../model/message.model")
const stream = require("stream");
const { google } = require('googleapis')
const path = require('path')

const auth = new google.auth.GoogleAuth(
    {
        keyFile: path.join(__dirname, "../../cred.json"),
        scopes: ['https://www.googleapis.com/auth/drive']
    }
)
var registercode

const generateRandomCode = () => {
    const min = 100000;
    const max = 999999;
    registercode = Math.floor(Math.random() * (max - min + 1)) + min;
}

const outPut = {}

const createUser = async (req, res, next) => {
    const body = req.body
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
            outPut.message = error.message
            res.json(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.message = "please check your email to register account"
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
        <p style="text-align:center">Please click <a style="font-weight:bold;color:green" href=${process.env.NODE_APP_URL}/active/${req.body.email}>here</a> to acctive your account<p>`
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
    userModel.updateOne({ "email": req.params.email }, { "active": true })
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

const createBlog = async (req, res) => {
    const userId = res.id
    const body = req.body
    body.author = userId
    const newBlog = await blogModel.create(body)
    const user = await userModel.findOne({ "_id": userId })
    const userBlogs = user.blogs
    const newBlogs = [...userBlogs, newBlog._id]
    await userModel.updateOne({ "_id": userId }, { "blogs": newBlogs })
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
            throw error.message
        }).then(() => {
            outPut.success = true
            outPut.msg = "your blog have been created"
            res.json(outPut)
        })
}

const UploadBlogCover = (req, res) => {
    const uploadFile = req.files.file;
    const namefile = uploadFile.name
    uploadFile.mv(`public//img//blog//${namefile}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send(namefile)
        }
    })
}

const UploadAvata = async (req, res) => {

    const uploadFile = req.files.file;
    const namefile = uploadFile.name
    uploadFile.mv(`public//img//avata//${namefile}`, (err) => {
        if (err) {
            console.log(err);
        } else {
            res.send(namefile)
        }
    })
}

const createCart = async (req, res) => {
    const userId = res.id
    const bookId = req.params.bookid
    const user = await userModel.findOne({ "_id": userId })
    const book = await bookModel.findOne({ "_id": bookId })
    const cart = await cartModel.findOne({ "borrower": userId, "lender": book.owner })
    const body = {
        borrower: userId,
        lender: book.owner,
    }
    if (!cart) {
        body.books = [bookId]
        const result = await cartModel.create(body)

        await userModel.updateOne({ "_id": userId }, { "carts": [...user.carts, result && result._id] })
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
            }).then(() => {
                outPut.success = true
                outPut.msg = "your cart have been created"
                res.json(outPut)
            })
    } else {
        const cartbooks = cart.books.filter(item => item.toString() !== bookId)
        body.books = [...cartbooks, bookId]
        await cartModel.updateOne({ "_id": cart._id }, body)
            .catch((error) => {
                outPut.success = false
                outPut.msg = error.message
                res.send(outPut)
            }).then(() => {
                outPut.success = true
                outPut.msg = "your cart have been update"
                res.json(outPut)
            })
    }

}

const uploadFile = async (req, res) => {
    const uploadFile = req.files.file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(uploadFile.data);
    const { data } = await google.drive({ version: "v3", auth }).files.create({
        media: {
            mimeType: uploadFile.mimeType,
            body: bufferStream,
        },
        requestBody: {
            name: uploadFile.name,
            parents: ["1_MKs0rO1Zre0hBmf4xSLcNPshPCpHsLM"],
        },
        fields: "id,name",
    });
    res.json(data.id)
}

const createRoom = async (req, res) => {
    const id = res.id
    const query = req.query

    if (query.clientUser) {
        const clientIsHost = await roomModel.findOne({ "host": query.clientUser, "member": id })
        const hostIsClient = await roomModel.findOne({ "host": id, "member": query.clientUser })

        if (clientIsHost) {
            res.send(clientIsHost)
        } else {
            if (hostIsClient) {
                res.send(hostIsClient)
            } else {
                const body = {}
                body.host = id
                body.member = [query.clientUser]
                await roomModel.create(body)
                    .catch((error) => {
                        outPut.success = false
                        outPut.msg = error.message
                        res.send(outPut)
                    }).then((data) => {
                        res.send(data)
                    })

            }
        }

    } else {
        res.send("client username is not exist")
    }

}
const createMsg = async (req, res) => {
    const id = res.id

    const body = req.body

    await messageModel.create(body)
        .catch((error) => {
            outPut.success = false
            outPut.msg = error.message
            res.send(outPut)
        }).then(async (data) => {
            const result = await roomModel.findOne({ "_id": body.room }, "messages")
            const newMessages = [...result.messages, data]
            await roomModel.updateOne({ "_id": body.room }, { "messages": newMessages })
            outPut.success = true
            outPut.msg = "your message have been create"
            res.json(outPut)
        })

}

const postController = {
    createUser,
    sendMailToRegister,
    sendMailToActive,
    activeAccount,
    login,
    createBook,
    createBlog,
    UploadBlogCover,
    UploadAvata,
    createCart,
    uploadFile,
    createRoom,
    createMsg,

}
module.exports = postController