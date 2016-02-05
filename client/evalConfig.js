var _ = require("underscore");
var p = require("path");
var evalPort = require(p.resolve(__dirname, "../commons/evals/port"));
var evalHost = require(p.resolve(__dirname, "../commons/evals/host"));
var evalHttpsEnabled = require(p.resolve(__dirname, "../commons/evals/httpsEnabled"));

module.exports = function(config){
	
	evalPort(config);
	evalHost(config);
	evalHttpsEnabled(config);
	
	var packageRootURL = config.packageRootURL;
	
	if(!packageRootURL){
		throw new Error("You have to define base URL to fetch packages.");
	}else if(!_.isString(packageRootURL)){
		throw new Erorr("The base package URI must be a string.");
	}
	
};