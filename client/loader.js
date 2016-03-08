var _ = require("underscore");
var path = require("path");
var express = require("express");
var bluebird = require("bluebird");
var speedyStatic = require("speedy-static");

module.exports = function(app, config){
	
	return new bluebird.Promise(function(res, rej){
		
		if(config.mainPackage){
			app.get("/", require(path.resolve(__dirname, "./services/preparedIndex.js"))(config));
		}
		
		app.get("/:main", require(path.resolve(__dirname, "./services/index.js"))(config));
		
		new bluebird.Promise(function(res, rej){
			res(speedyStatic(path.resolve(__dirname, "./statics"), _.extend(_.clone(config), {"max-cache-size":5242880})));
		}).then(function(middleware){
			app.use("/statics", middleware);
			res(app);
		});
		
	});
	
};