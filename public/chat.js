

window.onload = function () {
	var socket = io.connect();
	socket.on('connect', function () {
		//通過join事件發送暱稱
		socket.emit('join', prompt('What is your nickname?'));

		//顯示聊天室窗
		document.getElementById('chat').style.display = 'block';
		
		socket.on('announcement', function (msg) {
			var li = document.createElement('li');
			li.className = 'announcement';
			li.innerHTML = msg;
			document.getElementById('messages').appendChild(li);
		});
	});

	function addMessage (from, text) {
		var li = document.createElement('li');
		li.className = 'message';
		li.innerHTML = '<b>' + from + '</b>: ' + text;
		document.getElementById('messages').appendChild(li);
	}
	var input = document.getElementById('input');
	document.getElementById('form').onsubmit = function () {
		addMessage('me', input.value);
		socket.emit('text', input.value);


		//重置輸入框
		input.value = '';
		input.focus();

		return false;
	}

	socket.on('text', addMessage);

	//Play Music
	var playing = document.getElementById('playing');
	function play (song) {
		if (!song) return;
		playing.innerHTML = '<hr><b>Now Playing: </b> '
		+ song.ArtistName + ' ' + song.SongName + '<br>'

		var iframe = document.createElement('iframe');
		iframe.frameborder = 0;
		iframe.src = song.Url;
		palying.appendChild(iframe);
	};
	socket.on('song', paly);

	//search form
	var form = document.getElementById('dj');
	var results = document.getElementById('results');
	form.stytle.display = 'block';
	form.onsubmit = function () {
		results.innerHTML = '';
		socket.emit('search', document.getElementById('s').value, function (songs) {
			for (var i = 0; l = songs.length; i < l, i++) {
				(function (song) {
					var result = document.createElement('li');
					result.innerHTML = song.ArtistName + ' - <b>' + song.SongName + '</b> ';
					var a = document.getElementById('a');
					a.href = '#';
					a.innerHTML = function () {
						socket.emit('song', song);
						play(song);
						return false;
					} 
					result.appendChild(a);
					resuls.appendChild(result);
				})(song[i]);
			}
		});
		return false;
	};
	socket.on('elected', function () {
		form.className = 'isDJ';
	});
}