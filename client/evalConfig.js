var _ = require("underscore");
var path = require("path");
var evalPort = require(path.resolve(__dirname, "../commons/evals/port"));
var evalHost = require(path.resolve(__dirname, "../commons/evals/host"));
var evalHttpsEnabled = require(path.resolve(__dirname, "../commons/evals/httpsEnabled"));

module.exports = function(config){
	
	evalPort(config);
	evalHost(config);
	evalHttpsEnabled(config);
	
	var packageRootUrl = config.packageRootUrl;
	
	if(!packageRootUrl){
		throw new Error("You have to define base URL to fetch packages.");
	}else if(!_.isString(packageRootUrl)){
		throw new Erorr("The base package URI must be a string.");
	}
	
};