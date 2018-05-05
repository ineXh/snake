module.exports = exports = ClientInfo;

function ClientInfo(Name, ID){
    this.init(Name, ID);
} // end PlayerInfo
ClientInfo.prototype = {
    init: function(Name, ID){
    	this.Name = Name;
    	this.ID = ID;
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