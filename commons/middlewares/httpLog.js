const morgan = require("morgan");
const _ = require("underscore");
const dgram = require("dgram");
const net = require("net");
const stream = require("stream");
const cluster = require("cluster");
const path = require("path");
const streamer = require(path.join(__dirname, "../utils/streamer.js"));

module.exports = function(app, config){
		
	if(cluster.isMaster){
		var httpLogStreamer = streamer(config["http-log-stream"]);	    		
	}else{
		var socket = dgram.createSocket("udp4");
		var httpLogStreamer = new stream.Duplex({
			write: function(buffer, enc, next){								
				socket.send(buffer, 0, buffer.length, config["master-http-log-port"], "localhost");
				next();
			},
			read: function(){}
		});
	}
	
	/*
	 * Connect morgan logger to the http server
	 */
	var middleware = morgan(config["http-log-format"] || "dev", {stream:httpLogStreamer});
	
	return function(req, res, next){
		if(config["http-log"] && _.isArray(config["http-log-stream"])){
			middleware(req, res, next);
		}else{
			next();
		}
	};
	
};