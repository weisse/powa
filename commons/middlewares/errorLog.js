const dgram = require("dgram");
const stream = require("stream");
const cluster = require("cluster");
const path = require("path");
const streamer = require(path.join(__dirname, "../utils/streamer.js"));

module.exports = function(app, config){
		
	if(cluster.isMaster){
		var errorLogStreamer = streamer(config["error-log-stream"]);	    		
	}else{
		var socket = dgram.createSocket("udp4");
		var errorLogStreamer = new stream.Duplex({
			write: function(buffer, enc, next){								
				socket.send(buffer, 0, buffer.length, config["master-error-log-port"], "localhost");
				next();
			},
			read: function(){}
		});
	}
	
	return function(err, req, res, next){
		errorLogStreamer.write((new Date()).toISOString() + " " + err.stack);
		next(err);
	};
	
};