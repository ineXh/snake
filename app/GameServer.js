var Names = ['Amy', 'Bart', 'Bob', 'George', 'May', 'Mary', 'Michael', 'Nick',  'Peter', 'Steve', 'Tony'];
var gameIds = [0];
var playerIds = [0, 1, 2, 3, 4, 5];

var Game = require('./Game.js');
var ClientInfo = require('./ClientInfo.js');
module.exports = exports = GameServer;
function GameServer(io){
	var server = this;
	var playerList = {};
	this.games = {};
	this.io = io;

	io.on('connection', function(socket){
		var id = -1;
		socket.on('join server', onJoin.bind(server));
		socket.on('disconnect' , onDisconnect.bind(server));
		socket.on('join game'  , onJoinGame.bind(server));
		socket.on('leave game' , onLeaveGame.bind(server));
		socket.on('changeDirection' , onChangeDirection.bind(server));

		function onJoin(msg){
			//console.log(msg)

			id = msg.id != null ? msg.id : playerIds.shift();
			name = msg.name;

		    console.log(name + ' has joined. id: ' + id);
	    	if(playerList[id] == undefined) playerList[id] = new ClientInfo(name, id);
	    	if(playerList[id] != undefined){
	    		playerList[id].serverInfo.name = name;
	    		playerList[id].serverInfo.online = true;
	    	}

	    	socket.emit('joinServerSuccess', {name: name, id: id});
	    	socket.broadcast.emit('news', name + " has joined.");
	    	sendplayerList();

		} // end onJoin
		function onDisconnect(msg){
			//delete(playerList[id]);
			//this.playerIds.push(id);
			//console.log('onDisconnect')
			if(playerList[id] != undefined){
				//console.log(this.games)
				//console.log(playerList[id].serverInfo.gameId)
				game = this.games[playerList[id].serverInfo.gameId]
				if(game != undefined) game.leave(playerList[id], socket);
				playerList[id].serverInfo.gameId = -1
				playerList[id].serverInfo.online = false;
			}else{
				console.log('Error in onDisconnect')
				console.log('id: ' + id)
				console.log(playerList)
			}
		    console.log(playerList[id].serverInfo.name + ' has Left.');
		    socket.broadcast.emit('news', playerList[id].serverInfo.name + " has left.");
		    sendplayerList();
		}
		function onJoinGame(msg){
			game = this.findGame();
	    	if(game == null){
	    		var gameId = gameIds.shift();
	    		if(gameId == undefined) gameId = this.getLastGameID() + 1;
		    	var newGame = new Game(server, gameId);
		    	this.games[gameId] = newGame;
		    	newGame.join(playerList[id], socket);
		    	playerList[id].serverInfo.gameId = gameId;
	    	}else{
	    		game.join(playerList[id], socket);
	    		playerList[id].serverInfo.gameId = game.id;
	    	}
	    	sendplayerList();
		} // end onJoinGame
		function onLeaveGame(msg){
			this.games[playerList[id].serverInfo.gameId].leave(playerList[id], socket);
			playerList[id].serverInfo.gameId = -1;
			sendplayerList();
		} // end onLeaveGame
		function onChangeDirection(msg){
			//console.log('playerList[id].gameId ' + playerList[id].gameId)
			//console.log(this.games)
			//console.log(this.games[playerList[id].gameId])
			var game = this.games[playerList[id].serverInfo.gameId];
			if(game != undefined) game.onChangeDirection(io, playerList[id], msg);
		}
		function sendplayerList(){
			var msg = {}
			for(playerIndex in playerList){
				msg[playerIndex] = playerList[playerIndex].serverInfo;
			}
			io.local.emit('player list', msg);
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
		for(gameId in this.games){
			game = this.games[gameId]
			if(game.isFull == false) return game;
		}
		/*for(var i = 0; i < this.games.length; i++){
			game = this.games[i];
			if(game.isFull == false) return game;
		}*/
		return null;
	},
}