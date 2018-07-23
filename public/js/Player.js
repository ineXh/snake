function Player(clr){
    this.init(clr);
} // end PlayerInfo
Player.prototype = {
    init: function(clr){
		this.trail = [];
		this.clr = clr;
		this.reset(10, 10);
		this.dead = true;
    },
    reset: function(px, py){
    	this.px = px
    	this.py = py;
    	this.trail.length = 0;
    	this.tail = 5;
    	this.vx = this.vy = 0;
    	this.count = 0;
    },
    update: function(){
    	if(this.dead) return;
    	this.px += this.vx;
		this.py += this.vy;
		if(this.px < 0){
			this.px = gridSize-1;
		}
		if(this.px > gridSize-1){
			this.px = 0
		}
		if(this.py < 0){
			this.py = gridSize-1;
		}
		if(this.py > gridSize-1){
			this.py = 0
		}

		this.trail.push({x: this.px, y: this.py});

		for(var i = 0; i < this.trail.length-1; i++){
			if(this.trail[i].x == this.px && this.trail[i].y == this.py){
				this.tail = 5;
			}
		}


		if(!inGame && ax == this.px && ay == this.py){
			this.tail++;
			ax = Math.floor(Math.random()*gridSize);
			ay = Math.floor(Math.random()*gridSize);
		}
		while(this.trail.length > this.tail){
			this.trail.shift();
		}

		ctx.fillStyle = this.clr;
		for(var i = 0; i < this.trail.length; i++){
			ctx.fillRect(this.trail[i].x*gridSize, this.trail[i].y*gridSize, gridSize-2, gridSize-2);
		}
		this.count++;
    } // end update
}