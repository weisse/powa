var cluster = require("cluster");
var dgram = require("dgram");
var colors = require("colors");
var express = require("express");
var bluebird = require("bluebird");
var path = require("path");
var _ = require("underscore");
var url = require("url");
var commonDefaults = require(path.resolve(__dirname, "../defaults/common.config.json"));
var clientDefaults = require(path.resolve(__dirname, "../defaults/client.config.json"));
var serverDefaults = require(path.resolve(__dirname, "../defaults/server.config.json"));
var defaults = _.extend(_.clone(commonDefaults), _.extend(_.clone(serverDefaults), clientDefaults));
var clientEvalConfig = require(path.resolve(__dirname, "../client/evalConfig.js"));
var serverEvalConfig = require(path.resolve(__dirname, "../server/evalConfig.js"));
var commonTopLoader = require(path.resolve(__dirname, "../commons/topLoader.js"));
var commonBottomLoader = require(path.resolve(__dirname, "../commons/bottomLoader.js"));
var clientLoader = require(path.resolve(__dirname, "../client/loader.js"));
var serverLoader = require(path.resolve(__dirname, "../server/loader.js"));
var bootstrapText = require(path.join(__dirname, "../commons/bootstrapText/main.js"));
var showOptions = require(path.join(__dirname, "../commons/showOptions.js"));
var instantiateServer = require(path.join(__dirname, "../commons/instantiateServer.js"));
var activateLogServers = require(path.join(__dirname, "../commons/utils/activateLogServers.js"));
var manageCluster = require(path.join(__dirname, "../commons/utils/manageCluster.js"));
var masterMessage = function(host, port){
	return "POWA".yellow + " bundle is listening on HOST:" + host.cyan + " PORT:" + port.toString().cyan;
};
var workerMessage = function(host, port){
	return "POWA".yellow + " bundle worker " + cluster.worker.id.toString().green + " is listening on HOST:" + host.cyan + " PORT:" + port.toString().cyan;
};

module.exports = function(config){

	return new bluebird.Promise(function(res, rej){

		if(!config) config = {};
		config = _.extend(_.clone(defaults), config);
		
		/*
		 * the packageRootUrl has to match with bundle host and port if not defined
		 */
		if(!config.packageRootUrl){
			config.packageRootUrl = "//" + config.host + ":" + config.port + "/packages";
		}

		/*
		 * evaluate configurations
		 */
		clientEvalConfig(config);
		serverEvalConfig(config);

		if(config.cluster){

			if(cluster.isMaster){

				bootstrapText();
				
				activateLogServers(config).then(function(){
					
					if(config.showOptions){
						showOptions(config);
					}
					
					manageCluster("bundle", config).then(function(){
						res();
					});
					
				});

			}else{

				var app = express();

				commonTopLoader(app, config).then(function(app){
					return clientLoader(app, config);
				}).then(function(app){
					return serverLoader(app, config);
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
				return serverLoader(app, config);
			}).then(function(app){
				return commonBottomLoader(app, config);
			}).then(function(app){
				instantiateServer(app, config, masterMessage);
				res();
			});

		}

	});

};
