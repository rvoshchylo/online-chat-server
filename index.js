const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const app = express();

const route = require('./route');
const { addUser, findUser, getRoomUsers, isUserInRoom, removeUser } = require('./users');
const ADMIN = 'Admin';

app.use(route);
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  socket.on('joinCheck', ({name, room}) => {
    const isUserExist = isUserInRoom(name, room);

    if (isUserExist) {
      socket.emit('error', 'User with this name already exists in the room');
    }
  });

  socket.on('join', ({name, room}) => {
      socket.join(room);

      const { user, isExist } = addUser({name, room});

      const userMessage = isExist ? `${user.name} has re-joined!` : `Welcome to the room ${room}, ${name}!`;

      socket.emit('message', {
        data: {user: {name: ADMIN, message: userMessage}}
      });

      socket.broadcast.to(user.room).emit('message', {
        data: {user: {name: ADMIN, message: `${name} has joined!`}}
      });

      io.to(user.room).emit('joinRoom', { data: { room: user.room, users: getRoomUsers(user.room) }})
  });

  socket.on('sendMessage', ({ userMessage, params }) => {
    const user = findUser(params);

    if(user) {
      io.to(user.room).emit('message', {
        data: {user: {name: user.name, message: userMessage}}
      });
    }
  });

  socket.on('leftRoom', ({ params }) => {
    const user = findUser(params);

    if(user) {
      const removedUser = removeUser(user);
      if (removedUser) {
        const { room, name } = removedUser;
  
        io.to(room).emit('message', {
          data: {user: {name: ADMIN, message: `${name} has left!`}}
        });
      }
    }
  });
});  

server.listen(5001, () => {
  console.log('Server is running on port 5001');
});