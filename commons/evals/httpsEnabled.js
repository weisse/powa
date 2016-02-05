var _ = require("underscore");

module.exports = function(config){
	
	var httpsEnabled = config.httpsEnabled;
	
	if(httpsEnabled === true){
        var httpsOptions = config.httpsOptions;
        if(!httpsOptions || !_.isObject(httpsOptions)){
        	throw new Error("Since https was activated, you have to provide httpsOptions on your configurations.");
        }else{
        	var key = httpsOptions.key;
        	var cert = httpsOptions.cert;
        	var pfx = httpsOptions.pfx;
        	if(
    			((!key || !_.isString(key)) && (!cert || !_.isString(cert))) ||
    			!pfx || !_.isString(pfx)
			) throw new Error("Since https was activated, you have to provide a key and a certificate or a pfx on your configurations.");
        }
    }
	
}