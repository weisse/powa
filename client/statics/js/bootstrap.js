var _ = require("underscore");
var extensions = require("system-extensions");
_.extend(System, extensions);

System.import(System.mainPackage).then(function(main){
	
	console.info("Main package", System.mainPackage, "loaded successfully.");
	console.debug("Loaded value:", main);
	
}).catch(function(err){
	
	console.error(err);
	console.error("Main package", System.mainPackage, "not loaded.")
	
});