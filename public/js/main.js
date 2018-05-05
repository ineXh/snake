var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var socket = null;
var ID = parseInt(sessionStorage.getItem('ID')); //getRandomInt(0, 10); //localStorage
var name;
var connected = false;
var inGame = false;

var connectButton = function() {
	if(socket == null){
		connect();
	}else if(!socket.connected){
		connect();
	}else{
		socket.close();
		$("#ConnectServerButton").text("Connect")
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
	socket.on('player joins game', onPlayerJoin);
}

var joinServer = function(){
	Name = document.getElementById("Name").value;
    console.log(Name + ' joins server')
    socket.emit('join server', {Name: Name, ID: ID});
}
var onJoinServerSuccess = function(msg){
	Name = msg.Name;
	ID = msg.ID;
	sessionStorage.setItem('ID', ID);
	$("#news").text("Welcome " + Name + ".");
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
	}else{
		socket.emit('join game');
	}
} // end joinGame
function onJoinGameSuccess(msg){
	inGame = true;
	$("#JoinGameButton").text("Leave Game")
	console.log(msg)
	px = msg.px;
	py = msg.py;
	vx = vy = 0;
	gameUpdate();
}
function onPlayerJoin(msg){
	console.log('onPlayerJoin')
	console.log(msg)
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
		addPlayer(list[i].Name, list[i].Online, list[i].GameID)
	}
}

var addPlayer = function(name, online, gameID){
	if(gameID == -1) room = "Lobby"
	else room = "Game " + gameID;
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
	setTimeout(function(){

	}, 1000);

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
    now = Date.now();
    elapsed = now - lastTime;

    if (elapsed > fpsInterval) {
        lastTime = now - (elapsed % fpsInterval);
        gameUpdate();
    }
}

