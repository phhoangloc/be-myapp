const express = require('express')
const app = express()
const port = process.env.port || 4000
const routes = require('./src/routes')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path');
const fileUpload = require('express-fileupload')
const https = require('https');
const socketIo = require('socket.io');
const fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
};

const server = https.createServer(httpsOptions, app);

const io = socketIo(server, {
    cors: {
        origin: ['https://www.locand.jp']
    }
});

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

var online = []

io.on('connection', (socket) => {
    socket.emit('wel', 'Welcome to the chat!');

    socket.on("user", (user) => {
        socket.username = user.name
        online = [...online.filter(item => item != socket.username), socket.username]
        socket.emit("online", online)
        socket.broadcast.emit("online", online)
        socket.emit("msg", { sender: true, ...user });
        socket.broadcast.emit("msg", { sender: false, ...user });
    })

    socket.on('disconnect', () => {
        online.filter(item => item !== socket.username)
        socket && socket.username && socket.broadcast.emit("msg", { type: "leave", msg: socket.username + ' disconnected', online });

    });
});


server.listen(port, (err) => {
    if (err) throw err
    console.log("server is connectted with port: " + port)
})