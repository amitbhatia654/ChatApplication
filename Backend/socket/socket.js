const { Server } = require('socket.io')
const http = require("http")
const express = require("express");

const app = express();

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: [
            "http://localhost:5173",
            "http://192.168.29.68:5173",],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow specific headers
        exposedHeaders: ['Authorization', 'X-Total-Count'], // Expose specific response headers
        credentials: true, // Allow cookies
        maxAge: 600
    }
})

const userSocketMap = {};

const recieverSocketId = (userId) => {
    return userSocketMap[userId]
}

io.on("connection", (socket) => {
    console.log('user connected', socket.id)

    const userId = socket.handshake.query.userId;
    if (userId != undefined) userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    // console.log(userId, 'the user id is ')




    // //socket.on is used to listen the events used on both client and server 
    socket.on("disconnect", () => {
        delete userSocketMap[userId]
        console.log('user disconnected', socket.id)
        io.emit("getOnlineUsers", Object.keys(userSocketMap))

    })


})


module.exports = { app, io, server, recieverSocketId }
