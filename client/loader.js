var p = require("path");
var express = require("express");
var bluebird = require("bluebird");

module.exports = function(app){
	
	return new bluebird.Promise(function(res, rej){
		
		if(app.get("mainPackage")){
			
			app.get("/", require(p.resolve(__dirname, "./services/preparedIndex.js"))(app.get("mainPackage")));
			
		}
		
		app.get("/:main", require(p.resolve(__dirname, "./services/index.js")));
		app.use("/statics", express.static(p.resolve(__dirname, "./statics")));
		res(app);
		
	});
	
};