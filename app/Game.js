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
		this.players = [];
		this.playerSockets = [];
	},
	join: function(player, socket){
		this.players.push(player);
		console.log(player.Name + ' joins ' + this.name);
		//socket.leave('Global Chat');
		socket.join(this.name);
		var msg = {
			room: this.name
		}
		socket.emit('joinGameSuccess', msg)
	}, // end join
} // end Game