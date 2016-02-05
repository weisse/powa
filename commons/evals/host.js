var _ = require("underscore");

module.exports = function(config){
	
	var host = config.host;
	
	if(!host){
        throw new Error("You have to provide an host.");
    }else if(!_.isString(host)){
        throw new Error("The host must be a string");
    }
	
}