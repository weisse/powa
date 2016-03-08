module.exports = function(config){
	return function(req, res){
		if(config["allowCors"] && req.xhr){
			res.status(204).end();
		}
	};
};