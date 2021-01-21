const express = require('express');
const app = express();
const server = require('http').Server(app);

// THIS WILL FOR REAL TIME COMMUNICATION
const io = require('socket.io')(server);

// THIS WILL CREATE UNIQUE ID
const { v4: uuidv4 } = require('uuid');
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, { 
//     debug: true
// })

// USING THIS WE WILL SET TEMPLATE
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use('/peerjs', peerServer);

// ROUTING
app.get('/', (req, res)=>{
    res.redirect(`/${uuidv4()}`);
});


app.get('/:room', (req, res)=>{
    res.render('room', { roomId: req.params.room });
})

// THIS IS THE REAL TIME CONNECTION
io.on('connection', (socket)=>{

    socket.on('join-room', (roomId, userId)=>{
        socket.join(roomId); 
        socket.to(roomId).broadcast.emit('user-connected', userId);
    });

})

// SERVER LISTENING
server.listen(3030)