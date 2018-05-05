module.exports = exports = ClientInfo;

function ClientInfo(){
    this.init();
} // end PlayerInfo
ClientInfo.prototype = {
    init: function(){
    	this.Name = "";
    	this.ID = -1;
    	this.Online = true;
    	this.GameID = -1;
    	this.Socket = null; // can't do it
    	this.reset()
    }, // end init
    reset: function(){
    	this.px = 10;
    	this.py = 10;
    	this.vx = 0;
    	this.vy = 0;
    	this.trails = [];
    	this.tail = 5;
    }
} // end ClientInfo