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
	    		
	    		var versions = _.keys(versionsObject);
	    		var found = [];
	            
	            for(var i = versions.length - 1; i >= 0; i--){
	                if(semver.valid(versions[i])){
	                    if(semver.satisfies(versions[i], versionRegexp)){
	                        found.push(versions[i]);
	                    }
	                }else{
	                	if(versions[i] === versionRegexp){
	                		found.push(versions[i]);
	                	}
	                }
	            }
	
	            res.jsonp(found);
	    		
	    	}
	    	
	    });
	
	};
	
};
