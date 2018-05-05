function Player(){
    this.init();
} // end PlayerInfo
Player.prototype = {
    init: function(){
    	this.px = this.py = 10;
		this.vx = this.vy = 0;
		this.trail = [];
		this.tail = 5;
		this.clr = "green";
    },
    update: function(){
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

		ctx.fillStyle = this.clr;
		for(var i = 0; i < this.trail.length; i++){
			ctx.fillRect(this.trail[i].x*gridSize, this.trail[i].y*gridSize, gridSize-2, gridSize-2);
			if(this.trail[i].x == this.px && this.trail[i].y == this.py){
				this.tail = 5;
			}
		}
		this.trail.push({x: this.px, y: this.py});
		while(this.trail.length > this.tail){
			this.trail.shift();
		}
		if(ax == this.px && ay == this.py){
			this.tail++;
			ax = Math.floor(Math.random()*gridSize);
			ay = Math.floor(Math.random()*gridSize);
		}
    }
}