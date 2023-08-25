const express = require('express')
const app = express()
const port = process.env.port || 4000
const routes = require('./src/routes')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path');
const fileUpload = require('express-fileupload')

require('dotenv').config()

mongoose.connect(process.env.MONGODB)
    .catch((error) => {
        throw error.message
    })
    .then(() => {
        console.log("connect mongodb success! ")
    })

app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json())

app.use(cors())

routes(app)

app.listen(port, (err) => {
    if (err) throw err
    console.log("server is connectted with port: " + port)
})