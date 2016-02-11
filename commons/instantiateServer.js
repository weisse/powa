module.exports = function(app, config, message){
	
	if(config.httpsEnabled){
		
		var options = config.httpsOptions;
		var server = require("https").createServer(options, app);
		
	}else{
		
		var server = require("http").createServer(app);
		
	}

	server.listen(config.port, config.host, function(){
		console.info(message(config.host, config.port));
	});

};