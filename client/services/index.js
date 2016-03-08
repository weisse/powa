var fs = require("fs");
var path = require("path");

module.exports = function(config){
	return function(req, res, next){
		fs.readFile(path.resolve(__dirname, "../protected/index.html"), function(err, data){
			if(err){
				next(err);
			}else{
				res.end(
					data.toString("utf-8")
						.replace("@BASE_PACKAGE_URL", config["packageRootUrl"])
						.replace("@MAIN_PACKAGE", req.params["main"])
				);
			}
		});
	};
};