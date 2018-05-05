var fps = 15;
var canv, ctx;
var gridSize = 20;
var player;
var ax = ay = 15;

function gameSetup(){
	canv = document.getElementById("gc");
	ctx = canv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	player = new Player();
	//setInterval(game, 1000/15)
}

function gameUpdate(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canv.width, canv.height);

	player.update();

	ctx.fillStyle="red";
	ctx.fillRect(ax*gridSize, ay*gridSize, gridSize-2, gridSize-2);
}
function keyPush(evt){
	switch(evt.keyCode){
		case 37:
			player.vx= -1; player.vy = 0;
			if(socket != null) socket.emit('changeDirection', {vx: -1, vy: 0});
			break;
		case 38:
			player.vx= 0; player.vy = -1;
			if(socket != null) socket.emit('changeDirection', {vx: 0, vy: -1});
			break;
		case 39:
			player.vx= 1; player.vy = 0;
			if(socket != null) socket.emit('changeDirection', {vx: 1, vy: 0});
			break;
		case 40:
			player.vx= 0; player.vy = 1;
			if(socket != null) socket.emit('changeDirection', {vx: 0, vy: 1});
			break;
	}
}