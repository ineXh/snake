var getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
};

var socket;
var ID = getRandomInt(0, 10);
var name;

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
	px = py = 5;
	xv = yv = 0;
	gameUpdate();
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
		addPlayer(list[i].Name, list[i].Online)
	}
}

var addPlayer = function(name, online){
	if(online)
		$('#playerlist').append('<tr><td>' + name + '</td><td style="background-color:green;padding:10px"></td></tr>')
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
		socket = io.connect('http://localhost:5000/', {reconnection: false});
		//socket = io.connect('https://ancient-cove-94904.herokuapp.com/', {reconnection: false});

		socket.on('welcome', onWelcome);
		socket.on('news', onNews);
		socket.on('player list', onPlayerList);
		socket.on('joinGameSuccess', onJoinGameSuccess);
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

