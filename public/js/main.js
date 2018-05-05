var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var socket;
var ID = getRandomInt(0, 10);
var name;
var connected = false;

var join = function(){
	console.log('join')
	socket.emit('join', ID);
}
function joinGame() {
    name = document.getElementById("name").value;
    console.log(name + ' joins')
    socket.emit('join', {name: name, ID: ID});
}
function onJoinGameSuccess(msg){
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
function leaveGame() {
	console.log('leaveGame')
	//socket.close();
}
function connectButton() {
	if(connected){
		$("#ConnectButton").text("Connect")
		socket.close();
		connected = false;
	}else{
		connect();
	}
}
var onWelcome = function(msg){
	name = msg;
	$("#news").text("Welcome " + name + ".");
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

function connect(){
	socket = io.connect('http://localhost:5000/', {reconnection: false});
	//socket = io.connect('https://ancient-cove-94904.herokuapp.com/', {reconnection: false});
	connected = true;
	$("#ConnectButton").text("Disconnect")
	socket.on('welcome', onWelcome);
	socket.on('news', onNews);
	socket.on('player list', onPlayerList);
	socket.on('joinGameSuccess', onJoinGameSuccess);
	socket.on('player joins game', onPlayerJoin);
}

var Engine = (function(global) {
	setTimeout(function(){
		connect()
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

