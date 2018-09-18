var express = require('express');
var mysql = require('mysql');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = 3000;
server.listen(port);
//app.use(express.static(__dirname+'/public'));

//SQL(createPool)
var pool = mysql.createPool({
    connectionLimit:100, //Default
    host:'localhost',
    user:"root",
    password:"",
    database:"myimg",
    debug:true
});
function myConnection(req, res) {
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection DB"});
            return;
        };
        console.log('connect id'+connection.threadId);
        connection.query("select * from img where id=2", function (err, result) {
            connection.release();
            if(!err){
                res.json(result);
            }
        });
    })
};
app.get("/", function (req, res) {
    myConnection(req, res);
});

//SQL(createConnection)
/*var connection = mysql.createConnection({
    host:'localhost',
    user:"root",
    password:"",
    database:"myimg"
});
connection.connect(function () {
    console.log("db connect!");
});
var post = {name: "test"};
var query = connection.query("insert into img set ?", post, function (err, res) {
    console.log(err, res);
});*/

//CHAT:
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
console.log('test');
