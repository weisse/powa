var packageAnalyzation = require("system-package-analyzation");
var systemNormalize = System.normalize;

module.exports = function(name, parentName, parentAddress) {
	
	var self = this;
	
	return packageAnalyzation(name).then(function(powa){
		
		if(powa.hasSourcePath()){
			var normalizedName = powa.getFullSourceName(System.basePackageURL);
		}else{
			var normalizedName = powa.getRootName(System.basePackageURL);
		}
		
		return systemNormalize.call(self, normalizedName, parentName, parentAddress);
		
	}).catch(function(e){
		
		if(e.message === "You did not provide a valid package."){
			return systemNormalize.call(self, name, parentName, parentAddress);
		}else{
			throw(e);
		}
		
	});
	
};