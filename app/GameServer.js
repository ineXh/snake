var Names = ['Amy', 'Bart', 'Bob', 'George', 'May', 'Mary', 'Michael', 'Nick',  'Peter', 'Steve', 'Tony'];
var GameIDs = [0];
var playerIDs = [0, 1, 2, 3, 4, 5];

var Game = require('./Game.js');
var ClientInfo = require('./ClientInfo.js');
module.exports = exports = GameServer;
function GameServer(io){
	var server = this;
	var playerList = {};
	this.games = {};
	this.io = io;

	io.on('connection', function(socket){
		var ID = -1;
		socket.on('join server', onJoin.bind(server));
		socket.on('disconnect' , onDisconnect.bind(server));
		socket.on('join game'  , onJoinGame.bind(server));
		socket.on('leave game' , onLeaveGame.bind(server));
		socket.on('changeDirection' , onchangeDirection.bind(server));

		function onJoin(msg){
			//console.log(msg)

			ID = msg.ID != null ? msg.ID : playerIDs.shift();
			Name = msg.Name;

		    console.log(Name + ' has joined. ID: ' + ID);
	    	if(playerList[ID] == undefined) playerList[ID] = new ClientInfo(Name, ID);
	    	if(playerList[ID] != undefined){
	    		playerList[ID].Name = Name;
	    		playerList[ID].Online = true;
	    	}

	    	socket.emit('joinServerSuccess', {Name: Name, ID: ID});
	    	socket.broadcast.emit('news', Name + " has joined.");
	    	sendplayerList();

		} // end onJoin
		function onDisconnect(msg){
			//delete(playerList[ID]);
			//this.playerIDs.push(ID);
			if(playerList[ID] != undefined){
				playerList[ID].Online = false;
			}else{
				console.log('Error in onDisconnect')
				console.log('ID: ' + ID)
				console.log(playerList)
			}
		    console.log(playerList[ID].Name + ' has Left.');
		    socket.broadcast.emit('news', playerList[ID].Name + " has left.");
		    sendplayerList();
		}
		function onJoinGame(msg){
			game = this.findGame();
	    	if(game == null){
	    		var GameID = GameIDs.shift();
	    		if(GameID == undefined) GameID = this.getLastGameID() + 1;
		    	var newGame = new Game(server, GameID);
		    	this.games[GameID] = newGame;
		    	newGame.join(playerList[ID], socket);
		    	playerList[ID].GameID = GameID;
	    	}else{
	    		game.join(playerList[ID], socket);
	    		playerList[ID].GameID = game.ID;
	    	}
	    	sendplayerList();
		} // end onJoinGame
		function onLeaveGame(msg){
			this.games[playerList[ID].GameID].leave(playerList[ID], socket);
			playerList[ID].GameID = -1;
		} // end onLeaveGame
		function onchangeDirection(msg){
			this.games[playerList[ID].GameID].onchangeDirection(player, msg);
		}
		function sendplayerList(){
			io.local.emit('player list', playerList);
		} // end sendplayerList
	}); // end connection
	return this;
}
GameServer.prototype = {
	getLastGameID: function(){
		var keys = Object.keys(this.games);
		return parseInt(keys[keys.length-1]);
	},
	findGame: function(){
		for(GameID in this.games){
			game = this.games[GameID]
			if(game.isFull == false) return game;
		}
		/*for(var i = 0; i < this.games.length; i++){
			game = this.games[i];
			if(game.isFull == false) return game;
		}*/
		return null;
	},
}