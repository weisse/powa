var _ = require("underscore");

module.exports = function(config){
	
	var port = config.port;
	
	if(!port){
        throw new Error("You have to provide a port.");
    }else if((!_.isNumber(port) && !_.isString(port))){
        throw new Error("The port must be a number or a string.");
    }else{
        port = parseInt(port);
        if(_.isNaN(port)){
            throw new Error("The provided port doesn't represent a number.");
        }else if(port < 1 || port > 65535){
            throw new Error("The provided port must be a number between 1 and 65535.");
        }else{
        	config.port = port;
        }
    }
	
}