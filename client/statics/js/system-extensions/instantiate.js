var systemInstantiate = System.instantiate;

module.exports = function(module) {
	
	console.info(module.address, "loaded succesfully.");
	return systemInstantiate.apply(this, arguments);
	
};