var bluebird = require("bluebird");
var Package = require("Package");
var PowaPackage = require("PowaPackage");
var url = require("url");

var getDescriptorConfigurations = function(powa, descriptor){
	
	var package = powa.getPackage();
	var packageConfig = { map: {}, meta: {} };
	var config = { packages: {} };
	
	/*
	 * get the main source of the package
	 */
	packageConfig.main = descriptor.main;
	
	/*
	 * check if there are NPM_like dependencies
	 */
	if(descriptor.dependencies && _.isObject(descriptor.dependencies)){
		
		for(var name in descriptor.dependencies){
			
			var current = new Package(name, descriptor.dependencies[name]);
			packageConfig.map[current.getName()] = current.getSerialized();
			
		}
		
	}
	
	/*
	 * check if module format is defined
	 */
	if(descriptor.format && _.isString(descriptor.format)){
		packageConfig.format = descriptor.format;
	}
	
	/*
	 * check if there are some meta defined as shims
	 */
	if(descriptor.shim && _.isObject(descriptor.shim)){
		packageConfig.meta = descriptor.shim;
	}
	
	/*
	 * check if there are some meta directly defined
	 */
	if(descriptor.meta && _.isObject(descriptor.meta)){
		packageConfig.meta = descriptor.meta;
	}
	
	/*
	 * check if there are some map directly defined
	 */
	if(descriptor.map && _.isObject(descriptor.map)){
		packageConfig.map = descriptor.map;
	}
	
	/*
	 * apply package configuration on config
	 */
	config.packages[powa.getRootURL(System.basePackageURL)] = packageConfig;
	
	/*
	 * apply configurations on systemjs config
	 */
	System.config(config);
	
};

var checkPointedSource = function(powa){
	
	if(powa.hasSourcePath()){
		
		console.debug("The package points on a source.");
		console.debug("Load pointed source...");
		
	}else{
		
		console.debug("The package doesn't have a source path.");
		console.debug("Load package main source...");
		
	}
	
	return powa;
	
};

var ensurePackageDescriptor = function(powa){
	
	return new bluebird.Promise(function(res, rej){
		
		if(powa.hasDescriptor()){
			
			console.debug("The package descriptor was already loaded.");
			res(checkPointedSource(powa));
			
		}else{
			
			console.debug("The package descriptor was not loaded yet.");
			console.debug("Load package descriptor...");
			powa.loadDescriptor(System.basePackageURL)
				.then(function(data){
					
					console.debug("Package descriptor loaded successfully.");
					console.debug("Update configurations...")
					getDescriptorConfigurations(powa, data);
					console.debug("Configurations updated successfully.")
					res(checkPointedSource(powa));
					
				}).catch(function(e){
					
					console.error(e);
					rej(e);
					
				});
			
		}
		
	});
	
};

module.exports = function(moduleName){
	
	return new bluebird.Promise(function(res, rej){
		
		var name = url.parse(moduleName).path;
		
		console.debug("%cSystem.packageAnalyzation(" + name + ")", "font-weight:bold"); 
		console.debug("Analize package string:", name);
		
		var powa = new PowaPackage(name);
		
    	console.debug("The package is valid.");
    	if(powa.getPackage().hasActualVersion()){
    		
    		console.debug("The package has an actual version.");
    		res(ensurePackageDescriptor(powa));
    		
    	}else{
    		
    		console.debug("The package has not an actual version.");
    		console.debug("Search for a satisfying version...");
    		powa.searchSatisfyingVersion(System.basePackageURL)
    			.then(function(version){
    				
    				console.debug("Found version:", version);
    				res(ensurePackageDescriptor(powa));
    			
    			}).catch(function(e){
					
					rej(e);
					
				});
    		
    	}
		
	});
		
};