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

const whitelist = process.env.URL_ACEPTED || ['http://localhost:8080', 'https://myapp.co, http://localhost:4200'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  }
}
app.set('trust proxy', true);
app.use(cors(options));


//app.use('/public/images', express.static(path.resolve('public/storage/r')));
app.use(router)
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);






// Socket.io
const server = require('http').Server(app)
const io = require('socket.io')(server, {
  options: {
      cors: '*'
  }
});

io.on('connection', (socket) => {
  socket.on('join', (data) => {
      const roomName = data.roomName;
      socket.join(roomName);
      socket.to(roomName).broadcast.emit('new-user', data)

      socket.on('disconnect', () => {
          socket.to(roomName).broadcast.emit('bye-user', data)
      })
  })
})


server.listen(port, () => {
  console.log('Mi port ' +  port);
});

dbConnectMongoDB();
