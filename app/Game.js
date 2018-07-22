var updateTime = 100;
var gridSize = 20;

var utils = require("./Utils.js");
module.exports = exports = Game;
function Game(server, id){
	//this.server = server;
	//this.io = server.io;
	this.id = id;
	this.name = 'Game ' + id;
	console.log(this.name + ' created');
	this.init();
}
Game.prototype = {
	init: function(){
		this.isFull = false;
		this.players = {};
		this.playerLength = 0;
		this.playerIndices = [0, 1, 2, 3];
		this.ax = 10;
		this.ay = 10;
		//this.playerSockets = [];
		this.updateTimeout = setTimeout(this.update.bind(this), updateTime);
	},
	join: function(player, socket){
		this.playerLength++;
		player.gameInfo.playerIndex = this.playerIndices.shift();
		this.players[player.gameInfo.playerIndex] = player;
		if(this.playerLength >= 4) this.isFull = true;
		//this.playerSockets.push(socket);
		console.log(player.serverInfo.name + ' joins ' + this.name);

		//socket.leave('Global Chat');
		socket.join(this.name);

		var px = (player.gameInfo.playerIndex == 0) ? 5  :
				 (player.gameInfo.playerIndex == 1) ? 15 :
				 (player.gameInfo.playerIndex == 2) ? 5  :
				 (player.gameInfo.playerIndex == 3) ? 15 : 10;
		var py = (player.gameInfo.playerIndex == 0) ? 5  :
				 (player.gameInfo.playerIndex == 1) ? 5  :
				 (player.gameInfo.playerIndex == 2) ? 15 :
				 (player.gameInfo.playerIndex == 3) ? 15 : 10;

		player.gameInfo.px = px;
		player.gameInfo.py = py;

		var msg = {
			room: this.name,
			playerIndex: player.gameInfo.playerIndex,
			ax: this.ax,
			ay: this.ay,
			players: {}
		}
		for(playerIndex in this.players){
			msg.players[playerIndex] = this.players[playerIndex].gameInfo;
		}
		socket.emit('joinGameSuccess', msg) // send to player that just joined
		socket.to(this.name).emit('player joins game', msg); // send to other players
		//this.io.in(this.name).emit('player joins game', msg); // send to everyone in room
		//var onChangeDirection = this.onChangeDirection;
		//socket.on('changeDirection', onChangeDirection.bind(this, player));
		//socket.removeListener('changeDirection');
	}, // end join
	leave: function(player, socket){
		this.playerLength--;
		console.log(player.serverInfo.name + ' leaves ' + this.name);
		console.log('player.playerIndex ' + player.gameInfo.playerIndex)
		socket.leave(this.name);
		//console.log('delete')
		delete this.players[player.gameInfo.playerIndex];
		/*for(playerIndex in this.players){
			console.log(this.players[playerIndex].gameInfo)
		}*/
		this.playerIndices.push(player.gameInfo.playerIndex);
		//console.log(this.players)
	},
	onChangeDirection: function(io, player, msg){
		//console.log('onChangeDirection')
		//console.log(player.serverInfo.name + ': vx ' + msg.vx + ', vy ' + msg.vy)
		//console.log(msg)
		player.gameInfo.vx = msg.vx;
		player.gameInfo.vy = msg.vy;
		//msg.px = player.gameInfo.px;
		//msg.py = player.gameInfo.py;
		player.gameInfo.px = msg.px;
		player.gameInfo.py = msg.py;
		msg.playerIndex = player.gameInfo.playerIndex;
		io.in(this.name).emit('player changes direction', msg);

	},
	update: function(){
		this.updateTimeout = setTimeout(this.update.bind(this), updateTime);
		for(playerIndex in this.players){
			player = this.players[playerIndex]
			player.gameInfo.px += player.gameInfo.vx;
			player.gameInfo.py += player.gameInfo.vy;
			if(player.gameInfo.px < 0){
				player.gameInfo.px = gridSize-1;
			}
			if(player.gameInfo.px > gridSize-1){
				player.gameInfo.px = 0
			}
			if(player.gameInfo.py < 0){
				player.gameInfo.py = gridSize-1;
			}
			if(player.gameInfo.py > gridSize-1){
				player.gameInfo.py = 0
			}
		}

		/*
		for(var i = 0; i < this.players.length; i++){
			var player = this.players[i];
			player.px += player.vx;
			player.py += player.vy;
		}*/
	} // end periodicUpdate
} // end Game