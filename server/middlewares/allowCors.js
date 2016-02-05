module.exports = function(req, res, next){
	
	res.setHeader("Access-Control-Allow-Origin", req.app.get("allowedOrigin"));
	res.setHeader("Access-Control-Allow-Headers", req.app.get("allowedHeaders"));
	res.setHeader("Access-Control-Allow-Methods", req.app.get("allowedMethods"));
	res.setHeader("Access-Control-Allow-Credentials", req.app.get("allowCredentials"));
	next();
	
}