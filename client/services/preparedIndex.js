var fs = require("fs");
var path = require("path");

module.exports = function(mainPackage){

	return function(req, res){
		
		fs.readFile(path.resolve(__dirname, "../protected/index.html"), function(err, data){
			
			if(err){
				
				res.status(500).end();
				
			}else{
				
				res.end(
					data.toString("utf-8")
						.replace("@BASE_PACKAGE_URL", req.app.get("packageRootURL"))
						.replace("@MAIN_PACKAGE", mainPackage)
				);
				
			}
			
		});
		
	};
	
};