$(document).ready(function () {
    var login = prompt('Vvedite name'),
        privateId;
    if(!login) login = "Ananimus"+(new Date().getTime());
    var port = 3000;
    var socket = io.connect('http://localhost:' + port);
    socket.on("userName", function (userName) {
        $('.wrap').append("<p>" + userName +  " - connection! </p>");
    });
    socket.on("newUser", function (newUser) {
        $('.wrap').append("<p>" + newUser + " - connection!</p>");
    });
    socket.on("messageToClient", function (msg, name, socket_id) {
        $('.wrap').append("<p data-id='" + socket_id + "'><a class='user' href='#'>" + name +"</a>"+ ": " + msg + "</p>");
    });
    socket.on("messageToClientPrivate", function (msg, name, socket_id) {
        $('.wrap').append("<p data-id='" + socket_id + "'><a class='user' href='#' style='color:red'>" + name +"</a>"+ ": " + msg + "</p>");
    });
    socket.emit('login', login);
    $('.send').on('click', function (e) {
        e.preventDefault();
        $('#text').remove(".to");
        var mes = $('#text').val();
        (!privateId) ? socket.emit('message', mes) : socket.emit('messagePrivate', mes, privateId);
        $('#text').val('');
        privateId = null;
    });
    $('.wrap').on('click', '.user', function (e) {
        e.preventDefault();
        privateId = $(this).closest('p').attr("data-id");
        var privateName = $(this).text();
        $('#text').val("<span class='to'> to "+privateName+":</span>");
    })
});





