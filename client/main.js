var cluster = require("cluster");
var colors = require("colors");
var express = require("express");
var bluebird = require("bluebird");
var p = require("path");
var _ = require("underscore");
var app = express();
var commonDefaults = require(p.resolve(__dirname, "../defaults/common.config.json"));
var clientDefaults = require(p.resolve(__dirname, "../defaults/client.config.json"));
var defaults = _.extend(_.clone(commonDefaults), clientDefaults);
var evalConfig = require(p.resolve(__dirname, "./evalConfig.js"));
var loader= require(p.resolve(__dirname, "./loader.js"));
var bootstrapText = require(p.join(__dirname, "../commons/bootstrapText/main.js"));

module.exports = function(config){
	
	return new bluebird.Promise(function(res, rej){
		
		if(!config) config = {};
		config = _.extend(defaults, config);
		evalConfig(config);
		for(var attr in config) app.set(attr, config[attr]);
		
		loader(app).then(function(app){
			
			var host = app.get("host");
			var port = app.get("port");
			
			if(config.httpsEnabled){
				
				var options = config.httpsOptions;
				var server = require("https").createServer(options, app);
				
			}else{
				
				var server = require("http").createServer(app);
				
			}
			
			if(config.cluster){
				
				if(cluster.isMaster){
					
					bootstrapText();
					
					var workers = config.workers;
					if(!workers) workers = require("os").cpus().length;
					cluster.fork();
					
					cluster.on("listening", function(){
						if(--workers > 0) cluster.fork();
					});
					
					cluster.on("exit", function(worker, code, signal){
						console.warn("POWA".yellow + " client worker " + worker.id.toString().green + " died".red);
						if(workers == 0 && config.resumeWorker) cluster.fork();
					});
					
					res(app);
					
				}else{
					
					server.listen(port, host, function(){
						
						console.info("POWA".yellow + " client worker " + cluster.worker.id.toString().green + " is listening on", "HOST:", host.cyan, "PORT:", port.toString().cyan);
						
					});
					
				}
				
			}else{
				
				bootstrapText();
				
				server.listen(port, host, function(){
					
					console.info("POWA".yellow + " client is listening on", "HOST:", host.cyan, "PORT:", port.toString().cyan);
					res(app);
					
				});
				
			}
			
		});
		
	});
	
};

