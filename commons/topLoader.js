const p = require("path");
const bluebird = require("bluebird");
const morgan = require("morgan");
const url = require("url");
const fs = require("fs");
const _ = require("underscore");
const streamer = require(p.resolve(__dirname, "./utils/streamer.js"));
const cluster = require("cluster");
const dgram = require("dgram");
const stream = require("stream");

module.exports = function(app, config){

	return new bluebird.Promise(function(res, rej){
		
		/*
		 * Set streamer
		 */    
		app.use(require(p.join(__dirname, "./middlewares/httpLog.js"))(app, config));
		
		/*
		 * Allow CORS requests
		 */
		app.use("/*", require(p.join(__dirname, "./middlewares/allowCors.js"))(config));
	    app.options("/*", require(p.join(__dirname, "./middlewares/options.js"))(config));
		
	    res(app);
	    
	});

}
