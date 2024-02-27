require("dotenv").config();

const express = require('express');
const cors = require('cors');
const router = require("../routes")
const dbConnectMongoDB = require("../config/mongo");
const { logErrors, errorHandler, boomErrorHandler } = require('../midleware/boomerrors');
//const path = require('path');




const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.set('trust proxy', true);
app.use(cors());


//app.use('/public/images', express.static(path.resolve('public/storage/r')));
app.use(router)
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);






// Socket.io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
      origin: ['http://localhost:3000', 'http://localhost:4200', '*'],
      methods: ['GET', 'POST'] // Puedes ajustar los métodos según tus necesidades
  }
});



io.on('connection', (socket) => {
  socket.on("join", async (data) => {
    socket.join(data.room);
  });

  socket.on('joinR', async (data) => {
    io.to(data.room).emit('call', data)
})

socket.on('arecord', async (data) => {
  console.log('arecord')
  io.to(data.room).emit('record', data)
})

socket.on('arecord2', async (data) => {
  console.log('arecord2')
  io.to(data.room).emit('record2', data)
})

socket.on('mirame', async (data) => {
  io.to(data.room).emit('miras', data)
})
});




//peerjs --port 9000

server.listen(port, () => {
  console.log('Mi port ' +  port);
});

dbConnectMongoDB();
