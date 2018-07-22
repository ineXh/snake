var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var socket = null;
var id = parseInt(sessionStorage.getItem('id')); //getRandomInt(0, 10); //localStorage
var name;
var inGame = false;

var connectButton = function() {
	if(socket == null){
		connect();
	}else if(!socket.connected){
		connect();
	}else{
		socket.close();
		$("#ConnectServerButton").text("Connect")
		inGame = false;
		var form = document.getElementById("NameInput");
	    form.style.display = "inline-table";
		$("#JoinGameButton").hide()
	}
} // end connectButton

var connect = function(){
	socket = io.connect('http://localhost:5000/', {reconnection: false});
	//socket = io.connect('https://ancient-cove-94904.herokuapp.com/', {reconnection: false});
	setTimeout( function(){
		if(socket.connected){
			setupConnection();
			joinServer();
		}else{
			$("#news").text('Connection Timed Out! :(');
			socket.io._reconnection =false;
		}
	}, 1000 );
} // end connect

var setupConnection = function(){
	socket.on('joinServerSuccess', onJoinServerSuccess);
	socket.on('news', onNews);
	socket.on('player list', onPlayerList);
	socket.on('joinGameSuccess', onJoinGameSuccess);
	socket.on('player joins game', onPlayerJoin); // other player joins
	socket.on('player changes direction', onPlayerChangeDirection);

}

var joinServer = function(){
	name = document.getElementById("Name").value;
    console.log(name + ' joins server')
    socket.emit('join server', {name: name, id: id});
}
var onJoinServerSuccess = function(msg){
	name = msg.name;
	id = msg.id;
	sessionStorage.setItem('id', id);
	$("#news").text("Welcome " + name + ".");
	$("#ConnectServerButton").text("Disconnect")
	var form = document.getElementById("NameInput");
    form.style.display = "none";
	$("#JoinGameButton").show()
}
function joinGame() {
	if(inGame){
		inGame = false;
		$("#JoinGameButton").text("Join Game")
		socket.emit('leave game');
		for(playerIndex in players){
			player = players[playerIndex]
			player.dead = true;
			playerPool.push(player)
			//players[playerIndex] = null;
			delete players[playerIndex]
		}
		player1.dead = false;
		player1.reset(10, 10)
	}else{
		socket.emit('join game');
	}
} // end joinGame
// Player1 joins
function onJoinGameSuccess(msg){
	console.log('onJoinGameSuccess')
	inGame = true;
	$("#JoinGameButton").text("Leave Game")
	console.log(msg)
	player1Index = msg.playerIndex;
	player1.dead = true;
	//player1.reset(msg.players[player1Index].px, msg.players[player1Index].py);
	// create existing players
	for(playerIndex in msg.players){
		//if(parseInt(playerIndex) == player1Index) continue;
		var player = playerPool.shift();
		if(parseInt(playerIndex) == player1Index) player.clr = "green"
		px = player.px;
		py = player.py;
		player.px = msg.players[playerIndex].px;
		player.py = msg.players[playerIndex].py;
		dx = msg.players[playerIndex].px - px;
		dy = msg.players[playerIndex].py - py;
		for(var i = player.trail.length-1; i >= 0; i--){
			player.trail[i].x += dx
			player.trail[i].y += dy
			if(player.trail[i].x < 0){
				player.trail[i].x = gridSize-1;
			}
			if(player.trail[i].x > gridSize-1){
				player.trail[i].x = 0
			}
			if(player.trail[i].y < 0){
				player.trail[i].y = gridSize-1;
			}
			if(player.trail[i].y > gridSize-1){
				player.trail[i].y = 0
			}
		}


		player.vx = msg.players[playerIndex].vx;
		player.vy = msg.players[playerIndex].vy;
		player.dead = false;
		players[playerIndex] = player;
	}
	ax = msg.ax;
	ay = msg.ay;
	gameUpdate();
}
// Other player joins
function onPlayerJoin(msg){
	console.log('onPlayerJoin')
	console.log(msg)
	var player = playerPool.shift();
	player.px = msg.players[msg.playerIndex].px;
	player.py = msg.players[msg.playerIndex].py;
	player.dead = false;
	players[msg.playerIndex] = player;
}

var onNews = function(msg){
	$("#news").text(msg);
}
var onPlayerList = function(msg){
	console.log('onPlayerList')
	console.log(msg)
	removePlayerList();
	list = msg;
	for(i in list){
		addPlayer(list[i].name, list[i].online, list[i].gameId)
	}
}
var onPlayerChangeDirection = function(msg){
	console.log('onPlayerChangeDirection')
	console.log(msg)
	if(msg.playerIndex != player1Index){
		player = players[msg.playerIndex];
		player.px = msg.px;
		player.py = msg.py;
		player.vx = msg.vx;
		player.vy = msg.vy;
	}

}


var addPlayer = function(name, online, gameId){
	if(gameId == -1) room = "Lobby"
	else room = "Game " + gameId;
	if(online)
		$('#playerlist').append('<tr><td>' + name + '</td>' +
								'<td style="background-color:green;padding:10px"></td>' +
								'<td>' + room + '</td></tr>')
	else
		$('#playerlist').append('<tr><td>' + name + '</td><td style="background-color:red;padding:10px"></td></tr>')
}
var removePlayerList = function(){
	if($('#playerlist')[0].children[0] == undefined) return;
	length = $('#playerlist')[0].children[0].children.length
	for(var i = 0; i < length; i++){
		$('#playerlist')[0].children[0].children[0].remove()
	}
}


var Engine = (function(global) {
	//setTimeout(function(){}, 1000);
	fpsInterval = 1000 / fps;
    lastTime = Date.now();
    startTime = lastTime;
    gameSetup();
	animate();
})(this);

function animate() {
    //if(gamestate != GameState.PauseGame) renderer.render(stage0);
    //if(gamestate != GameState.PauseGame) update();
    requestAnimationFrame( animate );
    count++;
    now = Date.now();
    elapsed = now - lastTime;
    $("#time").text('elapsed: ' + (elapsed/1000))

    if (elapsed > fpsInterval) {
        lastTime = now - (elapsed % fpsInterval);
        gameUpdate();
    }
}

