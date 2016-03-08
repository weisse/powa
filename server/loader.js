var path = require("path");
var _ = require("underscore");
var express = require("express");
var bluebird = require("bluebird");
var speedyStatic = require("speedy-static");

module.exports = function(app, config){

	return new bluebird.Promise(function(res, rej){

	    app.get("/satisfy/:package", require(path.join(__dirname, "./services/satisfy.js"))(config));
	    app.get("/satisfyWithAll/:package", require(path.join(__dirname, "./services/satisfyWithAll.js"))(config));

	    new bluebird.Promise(function(res, rej){
			res(speedyStatic(path.resolve(config.packageRootPath), config));
		}).then(function(middleware){
			app.use("/packages", middleware);
			res(app);
		});

	});

}
