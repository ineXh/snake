module.exports = exports = ClientInfo;

function ClientInfo(name, id){
    this.init(name, id);
} // end PlayerInfo
ClientInfo.prototype = {
    init: function(name, id){
    	this.serverInfo = new ServerInfo();
    	this.socket = null; // can't do it
        this.gameInfo = new GameInfo();
    	this.reset()
    }, // end init
    reset: function(){
    	this.gameInfo.reset()
    }
} // end ClientInfo
function ServerInfo(name, id){
    this.init(name, id);
} // end ServerInfo
ServerInfo.prototype = {
    init: function(name, id){
        this.name = name;
        this.id = id;
        this.online = true;
        this.gameId = -1;
    }, // end init
    reset: function(){
    }
} // end ServerInfo

function GameInfo(){
    this.init();
} // end GameInfo
GameInfo.prototype = {
    init: function(){
        this.playerIndex = 0;
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
} // end GameInfo