module.exports = function(app, config, message){
	
	var host = app.get("host");
	var port = app.get("port");
	
	if(config.httpsEnabled){
		
		var options = config.httpsOptions;
		var server = require("https").createServer(options, app);
		
	}else{
		
		var server = require("http").createServer(app);
		
	}

	server.listen(port, host, function(){
		console.info(message(host, port));
	});

};