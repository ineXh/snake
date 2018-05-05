var updateTime = 100;
var utils = require("./Utils.js");
module.exports = exports = Game;
function Game(server, ID){
	this.server = server;
	this.io = server.io;
	this.ID = ID;
	this.Name = 'Game ' + ID;
	console.log(this.Name + ' created');
	this.init();
}
Game.prototype = {
	init: function(){
		this.isFull = false;
		this.players = [];
		this.playerSockets = [];
		this.updateTimeout = setTimeout(this.update.bind(this), updateTime);
	},
	join: function(player, socket){
		this.players.push(player);
		if(this.players.length >= 4) this.isFull = true;
		this.playerSockets.push(socket);
		console.log(player.Name + ' joins ' + this.Name);
		//socket.leave('Global Chat');
		socket.join(this.Name);
		var msg = {
			room: this.Name,
			px: 5,
			py: 5
		}
		socket.emit('joinGameSuccess', msg)
		socket.to(this.Name).emit('player joins game', msg);
		//this.io.in(this.Name).emit('player joins game', msg); // send to everyone in room
		//var onChangeDirection = this.onChangeDirection;
		//socket.on('changeDirection', onChangeDirection.bind(this, player));
		//socket.removeListener('changeDirection');
	}, // end join
	leave: function(player, socket){
		console.log(player.Name + ' leaves ' + this.Name);
		socket.leave(this.Name);
	},
	onChangeDirection: function(player, msg){
		//console.log('onChangeDirection')
		//console.log(player)
		//console.log(msg)
		player.vx = msg.vx;
		player.vy = msg.vy;
	},
	update: function(){
		this.updateTimeout = setTimeout(this.update.bind(this), updateTime);

		for(var i = 0; i < this.players.length; i++){
			var player = this.players[i];
			player.px += player.vx;
			player.py += player.vy;
		}
	} // end periodicUpdate
} // end Game