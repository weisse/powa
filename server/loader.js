var path = require("path");
var _ = require("underscore");
var express = require("express");
var bluebird = require("bluebird");

module.exports = function(app){
	
	return new bluebird.Promise(function(res, rej){
			
		if(app.get("allowCors")){
			
			app.use("/*", require(path.join(__dirname, "./middlewares/allowCors.js")));
		    app.options("/*", require(path.join(__dirname, "./middlewares/options.js")));
			
		}
		
	    app.get("/satisfy/:package", require(path.join(__dirname, "./services/satisfy.js")));
	    app.get("/satisfyWithAll/:package", require(path.join(__dirname, "./services/satisfyWithAll.js")));
	    app.use("/packages", express.static(path.resolve(app.get("packageRootPath"))));
		
	    res(app);
		
	});
	
}