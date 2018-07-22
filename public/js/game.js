function gameSetup(){
	canv = document.getElementById("gc");
	ctx = canv.getContext("2d");
	document.addEventListener("keydown", keyPush);
	player1 = new Player("green");
	player1.dead = false;

	for(var i = 0; i < 4; i++) playerPool.push(new Player("blue"))

	//setInterval(game, 1000/15)
}

function gameUpdate(){
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canv.width, canv.height);

	player1.update();

	/*for(var i = 0; i < players.length; i++){
		players[i].update();
	}*/
	for(playerIndex in players){
		player = players[playerIndex]
		player.update()
	}

	ctx.fillStyle="red";
	ctx.fillRect(ax*gridSize, ay*gridSize, gridSize-2, gridSize-2);
}
function keyPush(evt){
	px = player1.px; py = player1.py;
	if(inGame){
		px = players[player1Index].px
		py = players[player1Index].py
	}
	switch(evt.keyCode){
		case 37:
			vx= -1; vy = 0;
			player1.vx= vx; player1.vy = vy;
			if(socket != null && inGame){
				socket.emit('changeDirection', {px: px, py: py, vx: -1, vy: 0});
				players[player1Index].vx = vx
				players[player1Index].vy = vy
			}
			break;
		case 38:
			vx= 0; vy = -1;
			player1.vx= vx; player1.vy = vy;
			if(socket != null && inGame){
				socket.emit('changeDirection', {px: px, py: py, vx: 0, vy: -1});
				players[player1Index].vx = vx
				players[player1Index].vy = vy
			}
			break;
		case 39:
			vx= 1; vy = 0;
			player1.vx= vx; player1.vy = vy;
			if(socket != null && inGame){
				socket.emit('changeDirection', {px: px, py: py, vx: 1, vy: 0});
				players[player1Index].vx = vx
				players[player1Index].vy = vy
			}
			break;
		case 40:
			vx= 0; vy = 1;
			player1.vx= vx; player1.vy = vy;
			if(socket != null && inGame){
				socket.emit('changeDirection', {px: px, py: py, vx: 0, vy: 1});
				players[player1Index].vx = vx
				players[player1Index].vy = vy
			}
			break;
	}
}