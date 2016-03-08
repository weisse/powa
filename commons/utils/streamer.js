const stream = require("stream");
const dgram = require("dgram");
const net = require("net");
const fs = require("fs");
const p = require("path");
const url = require("url");

module.exports = function(streams){
	
	var logStream = new stream.Duplex({
		write: function(buffer, enc, next){
			this.push(buffer);
			next();
		},
		read: function(){}
	});
	for(var i = 0; i < streams.length; i++){
		var streamString = streams[i];
		/*
	     * Find out http log stream type
	     */
		if(streamString === "stdout"){
			logStream.pipe(process.stdout);
		}else if(streamString === "stderr"){
			logStream.pipe(process.stderr);
		}else{
			var parsed = url.parse(streamString);
			if(parsed.protocol && parsed.hostname && !parsed.path){
				switch(parsed.protocol.toLowerCase()){
					case "tcp:":
						var socket = net.createConnection(parsed.port, parsed.hostname)
						socket.on("error", function(e){							
							console.log(e);
							logStream.unpipe(socket);
						});
						logStream.pipe(socket);
					break;
					case "udp:":
						var dgramSocket = dgram.createSocket("udp4");
						logStream.pipe(new stream.Writable({
							write: function(buffer, enc, next){								
								dgramSocket.send(buffer, 0, buffer.length, parsed.port, parsed.hostname);
								next();
							}
						}));
					break;
					default:
						throw new Error("Invalid net stream.");
					break;
				}
			}else{
				logStream.pipe(fs.createWriteStream(p.resolve(process.cwd(), streamString)));
			} 
		}
	}
	
	return logStream;
	
};