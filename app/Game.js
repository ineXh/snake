var updateTime = 100;
var utils = require("./Utils.js");
module.exports = exports = Game;
function Game(server, name){
	this.server = server;
	this.io = server.io;
	this.name = name;
	console.log(this.name + ' created');
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
		console.log(player.Name + ' joins ' + this.name);
		//socket.leave('Global Chat');
		socket.join(this.name);
		var msg = {
			room: this.name,
			px: 5,
			py: 5
		}
		socket.emit('joinGameSuccess', msg)
		socket.to(this.name).emit('player joins game', msg);
		//this.io.in(this.name).emit('player joins game', msg); // send to everyone in room
		var onChangeDirection = this.onChangeDirection;
		socket.on('changeDirection', onChangeDirection.bind(this, player));
		//socket.removeListener('changeDirection');
	}, // end join
	leave: function(){
		socket.leave(this.name);
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