var p = require("path");
var express = require("express");
var bluebird = require("bluebird");
var speedyStatic = require("speedy-static");

module.exports = function(app){
	
	return new bluebird.Promise(function(res, rej){
		
		if(app.get("mainPackage")){
			
			app.get("/", require(p.resolve(__dirname, "./services/preparedIndex.js"))(app.get("mainPackage")));
			
		}
		
		app.get("/:main", require(p.resolve(__dirname, "./services/index.js")));
		
		new bluebird.Promise(function(res, rej){
			
			res(speedyStatic(p.resolve(__dirname, "./statics")));
			
		}).then(function(middleware){
			
			app.use("/statics", middleware);
			res(app);
			
		});
		
	});
	
};