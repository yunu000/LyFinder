const express=require('express')
const app=express()
const http=require('http')
var server=http.createServer(app)
// const io = require("socket.io")(server);
// app.use(express.static("public"))
// io.on('connection',socket =>{
// 	console.log('new user')
// 	socket.emit('chat-message','Hello World')
// })
// server.listen(3000)
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:5000",
    methods: ["GET", "POST"]
  }
});

server.listen(3000);
const users = {}

io.on('connection', socket => {
  socket.on('new-user', name => {
    users[socket.id] = name
    socket.broadcast.emit('user-connected', name)
  })
  socket.on('send-chat-message', message => {
    socket.broadcast.emit('chat-message', { message: message, name: users[socket.id] })
  })
  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnected', users[socket.id])
    delete users[socket.id]
  })
})