const cluster = require("cluster");
const bluebird = require("bluebird");

module.exports = function(service, config){
	
	return new bluebird.Promise(function(res, rej){
		
		var workers = config.workers;
		if(!workers) workers = require("os").cpus().length;
		cluster.fork();

		cluster.on("listening", function(){
			if(--workers > 0) cluster.fork();
			else res();
		});

		cluster.on("exit", function(worker, code, signal){
			console.warn("POWA".yellow + " " + service + " worker " + worker.id.toString().green + " died".red);
			if(workers <= 0 && config.resumeWorker) cluster.fork();
		});
		
	});
	
};