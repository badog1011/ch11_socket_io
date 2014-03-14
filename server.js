

/**
*
* Module
*
**/
var express = require('express')
  , sio = require('socket.io')
  , request = require('superagent')

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

var io = sio.listen(app)
  , apikey = '{}'//API KEY
  , currentSong
  , dj

function elect (socket) {
	dj = socket;
	io.sockets.emit('announcement', socket.nickname + ' is the new dj');
	socket.emit('elected');
	socket.dj = true;
	socket.on('disconnect', function () {
		dj = null;
		io.sockets.emit('announcement', 'the dj left - next one to join become dj');
	});
}

io.sockets.on('connection', function (socket) {
	socket.on('join', function (name) {
		socket.nickname = name;
		socket.broadcast.emit('announcement', name + ' joined the chat');
		if (!dj) {
			elect(socket);
		} else {
			socket.emit('song', currentSong);
		}
	});
	socket.on('text', function (msg) {
		socket.broadcast.emit('text', socket.nickname, msg);
	});
	socket.on('search', function (q, fn) {
		request('http://tinysong.com/s/' + encodeURIComponent(q)
			+ '?key=' + apikey + '&format=json', function (res) {
				if (200 == res.status) fn(JSON.parse(res.text));
			});
	});
	socket.on('song', function (song) {
		if (socket.dj) {
			currentSong = song;
			socket.broadcast.emit('song', song);
		}
	});
	// console.log('Someone connected');
});