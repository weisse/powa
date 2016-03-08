module.exports = function(config){
	return function(req, res, next){
		if(config["allowCors"] && req.xhr){
			res.setHeader("Access-Control-Allow-Origin", config["allowedOrigin"]);
			res.setHeader("Access-Control-Allow-Headers", config["allowedHeaders"]);
			res.setHeader("Access-Control-Allow-Methods", config["allowedMethods"]);
			res.setHeader("Access-Control-Allow-Credentials", config["allowCredentials"]);
		}
		next();
	}
}