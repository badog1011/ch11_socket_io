

/**
*
* Module
*
**/
var express = require('express')
  , sio = require('socket.io')

/**
*
* Create app
*
**/

app = express.createServer(
	express.bodyParser()
  , express.static('public')
	);

app.listen(3000);

var io = sio.listen(app);

io.sockets.on('connection', function (socket) {
	socket.on('join', function (name) {
		socket.nickname = name;
		socket.broadcast.emit('announcement', name + ' joined the chat');
	});
	socket.on('text', function (msg) {
		socket.broadcast.emit('text', socket.nickname, msg);
	});
	// console.log('Someone connected');
});