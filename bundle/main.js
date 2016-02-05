var cluster = require("cluster");
var colors = require("colors");
var express = require("express");
var bluebird = require("bluebird");
var path = require("path");
var _ = require("underscore");
var url = require("url");
var app = express();
var commonDefaults = require(path.resolve(__dirname, "../defaults/common.config.json"));
var clientDefaults = require(path.resolve(__dirname, "../defaults/client.config.json"));
var serverDefaults = require(path.resolve(__dirname, "../defaults/server.config.json"));
var defaults = _.extend(_.clone(commonDefaults), _.extend(_.clone(serverDefaults), clientDefaults));
var clientEvalConfig = require(path.resolve(__dirname, "../client/evalConfig.js"));
var serverEvalConfig = require(path.resolve(__dirname, "../server/evalConfig.js"));
var clientLoader = require(path.resolve(__dirname, "../client/loader.js"));
var serverLoader = require(path.resolve(__dirname, "../server/loader.js"));
var bootstrapText = require(path.join(__dirname, "../commons/bootstrapText/main.js"));

module.exports = function(config){
	
	return new bluebird.Promise(function(res, rej){
		
		if(!config) config = {};
		config = _.extend(defaults, config);
		
		/*
		 * the packageRootURL has to match with bundle host and port
		 */
		config.packageRootURL = "//" + config.host + ":" + config.port + "/packages";
		
		/*
		 * evaluate configurations
		 */
		clientEvalConfig(config);
		serverEvalConfig(config);
		
		/*
		 * set application vars
		 */
		for(var attr in config) app.set(attr, config[attr]);
		
		clientLoader(app)
		.then(serverLoader)
		.then(function(app){
			
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
						console.warn("POWA".yellow + " bundle worker " + worker.id.toString().green + " died".red);
						if(workers == 0 && config.resumeWorker) cluster.fork();
					});
					
					res(app);
					
				}else{
					
					server.listen(port, host, function(){
						
						console.info("POWA".yellow + " bundle worker " + cluster.worker.id.toString().green + " is listening on", "HOST:", host.cyan, "PORT:", port.toString().cyan);
						
					});
					
				}
				
			}else{
				
				bootstrapText();
				
				server.listen(port, host, function(){
					
					console.info("POWA".yellow + " bundle is listening on", "HOST:", host.cyan, "PORT:", port.toString().cyan);
					res(app);
					
				});
				
			}
			
		});
		
	});
	
};
