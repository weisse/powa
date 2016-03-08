const path = require("path");
const dgram = require("dgram");
const bluebird = require("bluebird");
const streamer = require(path.resolve(__dirname, "./streamer.js"));

module.exports = function(config){
	
	var promises = [];
		
	var httpLogServer = dgram.createSocket("udp4");
	var httpLogStreamer = streamer(config["http-log-stream"]);
	
	httpLogServer.on("message", function(msg, rinfo){
		httpLogStreamer.write(msg);
	});
	
	promises.push(new bluebird.Promise(function(res, rej){
		httpLogServer.on("listening", function(){
			res();
		});
	}));
	
	httpLogServer.bind(config["master-http-log-port"]);
	
	var errorLogServer = dgram.createSocket("udp4");
	var errorLogStreamer = streamer(config["error-log-stream"]);
	
	promises.push(new bluebird.Promise(function(res, rej){
		errorLogServer.on("listening", function(){
			res();
		});
	}));
	
	errorLogServer.on("message", function(msg, rinfo){
		errorLogStreamer.write(msg);
	});
	
	errorLogServer.bind(config["master-error-log-port"]);
	
	return bluebird.Promise.all(promises);
	
};