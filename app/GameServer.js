var Names = ['Amy', 'Bart', 'Bob', 'George', 'May', 'Mary', 'Michael', 'Nick',  'Peter', 'Steve', 'Tony'];
var gameIDs = [0, 1, 2, 3, 4, 5];

var Game = require('./Game.js');
var ClientInfo = require('./ClientInfo.js');
module.exports = exports = GameServer;
function GameServer(io){
	var server = this;
	var playerList = {};
	this.games = [];
	this.io = io;

	io.on('connection', function(socket){
		var client = new ClientInfo();
		socket.on('join', onJoin.bind(server));
		socket.on('disconnect', onDisconnect.bind(server));

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

	    	game = this.findGame();
	    	if(game == null){
	    		var gameID = gameIDs.shift();
		    	var newGame = new Game(server, 'Game ' + gameID);
		    	this.games.push(newGame);
		    	newGame.join(client, socket);
	    	}else{
	    		game.join(client, socket);
	    	}
		} // end onJoin
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
		/*function findGame(){
			for(var i = 0; i < this.games.length; i++){
				game = this.games[i];
				if(game.isFull == false) return game;
			}
			return null;
		}*/
		function sendplayerList(){
			io.local.emit('player list', playerList);
		} // end sendplayerList
	}); // end connection
	return this;
}
GameServer.prototype = {
	findGame: function(){
		for(var i = 0; i < this.games.length; i++){
			game = this.games[i];
			if(game.isFull == false) return game;
		}
		return null;
	},
}