const express = require('express')
const app = express()
const port = process.env.port || 4000
const routes = require('./src/routes')
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
const path = require('path');
const fileUpload = require('express-fileupload')
const https = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem'),
};

const server = https.createServer(httpsOptions, app);

const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000']
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

    socket.on("hello", data => {
        socket.username = data.username
        socket.broadcast.emit("hello", data)
        online = [...online.filter(item => item.username != socket.username), data]
        socket.emit("online", online)
        socket.broadcast.emit("online", online)
    })

    socket.on("enterRoom", (data) => {
        socket.join(data);
    })

    socket.on("signal", (data) => {

        socket.emit("signal", data)
        socket.broadcast.emit("signal", data)
        socket.to(data.room).emit("signal", data)
    })

    socket.on("user", (user) => {
        socket.username = user.name
        online = [...online.filter(item => item != socket.username), socket.username]
        socket.emit("online", online)
        socket.broadcast.emit("online", online)
        socket.emit("msg", { sender: true, ...user });
        socket.broadcast.emit("msg", { sender: false, ...user });
    })

    socket.on('disconnect', async () => {
        online = online.filter(item => item.username !== socket.username)
        socket.broadcast.emit("online", online)
        socket.broadcast.emit("wel", socket.username + ' is disconnected');

    });
});


server.listen(port, (err) => {
    if (err) throw err
    console.log("server is connectted with port: " + port)
})