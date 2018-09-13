var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 3000;
server.listen(port);
app.use(express.static(__dirname+'/public'));

var allUsersConnection = [];
io.on('connection', function (socket) {
    var name,
        socket_id = socket.id;
    socket.on('login', function (login) {
        name = login;
        allUsersConnection.push(name);
    });

    socket.broadcast.emit("newUser", name);
    socket.emit("userName", name);
    socket.on('message', function (msg) {
        io.sockets.emit('messageToClient', msg, name, socket_id);
    });
    socket.on('messagePrivate', function (msg, privateId) {
        console.log(privateId);
        socket.broadcast.to(privateId).emit('messageToClientPrivate', msg, name, socket_id);
    });
    console.log(allUsersConnection);
});

