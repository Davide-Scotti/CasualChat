const express = require('express')
const http = require('http')
const socketIO = require('socket.io')
const { v4:uuidv4 } = require('uuid')

const app = express()
const server = http.createServer(app)
const io = socketIO(server)
const PORT = process.env.PORT || 3000;

const chatRooms = {}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
  });

app.get('/:room', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    const privateChatQueue = []

   socket.on('joinRoom', ({room, username, chatType}) => {
    if(chatType === 'private') {
       privateChatQueue.push({id: socket.id, username})

       if(privateChatQueue.length >= 2) {
        const user1 = privateChatQueue.shift()
        const user2 = privateChatQueue.shift()

        const privateRoom = uuidv4()
        socket.join(privateRoom
            io.to.(user1.id).emit()
       }
    }

    socket.join(room)
    chatRooms[room].Push(socket.id)

    socket.to(room).emit('message', 'Welcome in CasualChat!')
   })

   socket.on('disconnect', () => {
    for(const room in chatRooms){
        const index = chatRooms[room].indexOf(socket.id)
        if(index !== -1){
            chatRooms[room].splice(index, 1);
            socket.to(room).emit('message', 'Un utente ha lasciato la chat')
        }
    }
   })
})

io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
      if (!chatRooms[room]) {
        chatRooms[room] = [];
      }
      socket.join(room);
      chatRooms[room].push({ id: socket.id, username: `Utente${chatRooms[room].length + 1}` });
  
      // Invia un messaggio di benvenuto agli altri utenti nella stanza
      socket.to(room).emit('message', `${socket.id} si è unito alla chat.`);
    });
  
    socket.on('sendMessage', (message) => {
      const user = chatRooms[room].find((u) => u.id === socket.id);
      io.to(room).emit('message', `${user.username}: ${message}`);
    });
  
    socket.on('disconnect', () => {
      for (const r in chatRooms) {
        const index = chatRooms[r].findIndex((u) => u.id === socket.id);
        if (index !== -1) {
          const user = chatRooms[r][index];
          chatRooms[r].splice(index, 1);
          // Invia un messaggio di uscita agli altri utenti nella stanza
          socket.to(r).emit('message', `${user.username} ha lasciato la chat.`);
        }
      }
    });
});

server.listen(PORT, () => {
    console.log("Server in ascolto sulla porta ${PORT}")
})