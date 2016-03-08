var cluster = require("cluster");
var colors = require("colors");
var express = require("express");
var bluebird = require("bluebird");
var path = require("path");
var _ = require("underscore");
var commonDefaults = require(path.resolve(__dirname, "../defaults/common.config.json"));
var clientDefaults = require(path.resolve(__dirname, "../defaults/client.config.json"));
var defaults = _.extend(_.clone(commonDefaults), clientDefaults);
var evalConfig = require(path.resolve(__dirname, "./evalConfig.js"));
var commonTopLoader = require(path.resolve(__dirname, "../commons/topLoader.js"));
var commonBottomLoader = require(path.resolve(__dirname, "../commons/bottomLoader.js"));
var clientLoader = require(path.resolve(__dirname, "./loader.js"));
var bootstrapText = require(path.join(__dirname, "../commons/bootstrapText/main.js"));
var showOptions = require(path.join(__dirname, "../commons/showOptions.js"));
var instantiateServer = require(path.join(__dirname, "../commons/instantiateServer.js"));
var activateLogServers = require(path.join(__dirname, "../commons/utils/activateLogServers.js"));
var manageCluster = require(path.join(__dirname, "../commons/utils/manageCluster.js"));
var masterMessage = function(host, port){
	return "POWA".yellow + " client is listening on HOST:" + host.cyan + " PORT:" + port.toString().cyan;
};
var workerMessage = function(host, port){
	return "POWA".yellow + " client worker " + cluster.worker.id.toString().green + " is listening on HOST:" + host.cyan + " PORT:" + port.toString().cyan;
};

module.exports = function(config){
	
	return new bluebird.Promise(function(res, rej){
		
		if(!config) config = {};
		config = _.extend(defaults, config);
		evalConfig(config);
			
		if(config.cluster){
			
			if(cluster.isMaster){
				
				bootstrapText();
				
				activateLogServers(config).then(function(){
					
					if(config.showOptions){
						showOptions(config);
					}
					
					manageCluster("client", config).then(function(){
						res();
					});
					
				});
				
			}else{
				
				var app = express();
				
				commonTopLoader(app, config).then(function(app){
					return clientLoader(app, config);
				}).then(function(app){
					return commonBottomLoader(app, config);
				}).then(function(app){
					instantiateServer(app, config, workerMessage);
					res();
				});
				
			}
			
		}else{
			
			bootstrapText();
			
			if(config.showOptions){
				showOptions(config);
			}
			
			var app = express();

			commonTopLoader(app, config).then(function(app){
				return clientLoader(app, config);
			}).then(function(app){
				return commonBottomLoader(app, config);
			}).then(function(app){
				instantiateServer(app, config, masterMessage);
				res();
			});
			
		}
		
	});
	
};

