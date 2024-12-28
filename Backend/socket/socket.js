const { Server } = require('socket.io')
const http = require("http")
const express = require("express");

const app = express();

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["https://mern-dashboard-orpin.vercel.app"],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'], // Allow specific headers
        exposedHeaders: ['Authorization', 'X-Total-Count'], // Expose specific response headers
        credentials: true, // Allow cookies
        maxAge: 600
    }
})


io.on("connection", (socket) => {
    console.log('user connected socket', socket.id)
    socket.emit("connecting", socket.id)
    socket.on("message", ({ roomId, message }) => {
        // console.log()
        socket.to(roomId).emit("recieve-msg", message)
    })


    socket.on("setup", (userData) => {
        socket.join(userData.id)
        socket.emit("connected")
    })

    socket.on('join chat', (room) => {
        socket.join(room)
        console.log('user joined room')
    })


    socket.on("send_message", (data) => {
        // console.log(data,'the sss')
        const { room, message } = data;
        io.to(room).emit("receive_message", message); // Send to all in the room
    });






    // //socket.on is used to listen the events used on both client and server 
    socket.on("disconnect", () => {
        console.log('disconneted ', socket.id)
    })


})


module.exports = { app, io, server }
