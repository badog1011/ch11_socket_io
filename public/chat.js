

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
}