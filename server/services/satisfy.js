var path = require("path");
var fs = require("fs");
var semver = require("semver");
var Package = require(path.join(__dirname, "../libs/Package.js"));

module.exports = function(config){

	return function(req, res, next){

	    var package = new Package(req.params.package);
	    var pathName = package.getName().replace(/\./g, "/");
	    var absolutePath = path.resolve(config["packageRootPath"], pathName, "@");
	    
	    fs.readdir(absolutePath, function(err, versions){
	    	
	    	if(err){
	    		
	    		next(err);
	    		res.status(404).end();
	    		
	    	}else{
	    		
	    		var versionRegexp = package.getVersion();
	    		
	    		for(var i = versions.length - 1; i >= 0; i--){
	                if(semver.valid(versions[i])){
	                    if(semver.satisfies(versions[i], versionRegexp)){
	                        res.jsonp(versions[i]);
	                        return;
	                    }
	                }else{
	                	if(versions[i] === versionRegexp){
	                		res.jsonp(versions[i]);
	                		return;
	                	}
	                }
	            }
	
	            res.jsonp(null);
	    		
	    	}
	    	
	    });
	
	};
	
};
