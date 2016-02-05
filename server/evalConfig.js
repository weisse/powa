var _ = require("underscore");
var p = require("path");
var evalPort = require(p.resolve(__dirname, "../commons/evals/port"));
var evalHost = require(p.resolve(__dirname, "../commons/evals/host"));
var evalHttpsEnabled = require(p.resolve(__dirname, "../commons/evals/httpsEnabled"));

module.exports = function(config){
	
	evalPort(config);
	evalHost(config);
	evalHttpsEnabled(config);
	
};