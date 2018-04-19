var Names = ['Amy', 'Bart', 'Bob', 'George', 'May', 'Mary', 'Michael', 'Nick',  'Peter', 'Steve', 'Tony'];
var gameIDs = [0, 1, 2, 3, 4, 5];

var Game = require('./Game.js');
module.exports = exports = GameServer;
function GameServer(io){
	var server = this;
	var playerList = {};
	this.games = [];
	this.io = io;

	io.on('connection', function(socket){
		var client = {
			"Name": "",
			"ID": -1,
			"Online": true,
			"GameID": -1
		}
		socket.on('join', onJoin.bind(server));
		socket.on('disconnect', onDisconnect.bind(server));
		socket.on('left', onLeft.bind(server));
		socket.on('right', onRight.bind(server));
		socket.on('up', onUp.bind(server));
		socket.on('down', onDown.bind(server));

		function onJoin(msg){
			//console.log(msg)
			//ID = this.playerIDs.shift();
			ID = msg.ID;
			name = msg.name;

			client.Name = name;//Names[ID];
			client.ID = ID;
		    console.log(client.Name + ' has joined. ID: ' + ID);
	    	if(playerList[ID] == undefined) playerList[ID] = client;
	    	if(playerList[ID] != undefined) playerList[ID].Online = true;

	    	socket.emit('welcome', client.Name);
	    	socket.broadcast.emit('news', client.Name + " has joined.");
	    	sendplayerList();

	    	var gameID = gameIDs.shift();
	    	var newGame = Game(server, 'Game ' + gameID);
	    	this.games.push(newGame);
	    	newGame.join(client, socket);
		}
		function onDisconnect(msg){
			ID = client.ID;
			//delete(playerList[ID]);
			//this.playerIDs.push(ID);
			if(playerList[ID] != undefined){
				playerList[ID].Online = false;
			}else{
				console.log('Error in onDisconnect')
				console.log('ID: ' + ID)
				console.log(playerList)
			}
		    console.log(client.Name + ' has Left.');
		    socket.broadcast.emit('news', client.Name + " has left.");
		    sendplayerList();
		}
		function sendplayerList(){
			io.local.emit('player list', playerList);
		} // end sendplayerList
		function onLeft(){

		}
		function onRight(){

		}
		function onUp(){

		}
		function onDown(){

		}
	}); // end connection
	return this;
}