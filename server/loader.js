var p = require("path");
var _ = require("underscore");
var express = require("express");
var bluebird = require("bluebird");
var speedyStatic = require("speedy-static");

module.exports = function(app){
	
	return new bluebird.Promise(function(res, rej){
			
		if(app.get("allowCors")){
			
			app.use("/*", require(p.join(__dirname, "./middlewares/allowCors.js")));
		    app.options("/*", require(p.join(__dirname, "./middlewares/options.js")));
			
		}
		
	    app.get("/satisfy/:package", require(p.join(__dirname, "./services/satisfy.js")));
	    app.get("/satisfyWithAll/:package", require(p.join(__dirname, "./services/satisfyWithAll.js")));
	    
	    new bluebird.Promise(function(res, rej){
			
			res(speedyStatic(p.resolve(app.get("packageRootPath"))));
			
		}).then(function(middleware){
			
			app.use("/packages", middleware);
			res(app);
			
		});
		
	});
	
}