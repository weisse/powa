var Package = require("./Package.js");
var _ = require("underscore");
var bluebird = require("bluebird");
var aja = require("aja");
var url = require("url");
var path = require("path");
var semver = require("semver");

var Class = function(fullPackageString){
	
	try{
		
		/*
		 * Parse the fullPackageString
		 */
		this.fillPropertiesByFullPackageString(fullPackageString);
		
		/*
		 * Wrap the package instance of this package
		 */
		this.package = new Package(this.fullPackageName);
		
		/*
		 * Search for package descriptor
		 */
		if(typeof System.packagesDescriptor != "undefined"){
			this.descriptor = System.packagesDescriptor[this.fullPackageName];
		}
		
	}catch(e){
		
		throw new Error("You did not provide a valid package.");
		
	}
	
};

Class.prototype = {
		
	fillPropertiesByFullPackageString: function(fullPackageString){
		
		if(fullPackageString && _.isString(fullPackageString)){
			
			/*
			 * Extract other options from the fullPackageString
			 */
			var nameSplittedByOptions = fullPackageString.split("!");
			var nameWithoutOptions = nameSplittedByOptions[0];
        	var options;
        	if(nameSplittedByOptions.length > 1) options = fullPackageString.split(nameWithoutOptions)[1]; 
        	else options = "";
        	fullPackageString = nameWithoutOptions;
        	
        	/*
        	 * Extract the source path (if present)
        	 */
        	var nameSplittedByPath = fullPackageString.split("/");
        	var nameWithoutPath = nameSplittedByPath[0];
        	var sourcePath = fullPackageString.split(nameWithoutPath)[1];
        	fullPackageString = nameWithoutPath;
        	
        	/*
        	 * Set object properties
        	 */
        	this.fullPackageName = fullPackageString;
        	this.options = options;
        	this.sourcePath = sourcePath;
        	
		}else{
		
			throw new Error("You have to provide a string to analyze");
			
		}
		
	},
	getPackage: function(){
		
		return this.package;
		
	},
	getFullpackageName: function(){
		
		return this.fullPackageName;
		
	},
	getOptions: function(){
		
		return this.options;
		
	},
	getSourcePath: function(){
		
		return this.sourcePath;
		
	},
	setName: function(){
		
		this.package.setName.apply(this.package, arguments);
		this.fullPackageName = this.package.getSerialized();
		
	},
	setVersion: function(){
		
		this.package.setVersion.apply(this.package, arguments);
		this.fullPackageName = this.package.getSerialized();
		
	},
	hasSourcePath: function(){
		
		if(this.sourcePath) return true;
		return false;
		
	},
	getDescriptor: function(){
		
		return this.descriptor || null;
		
	},
	getSerialized: function(){
		
		return this.package.getSerialized() + this.getSourcePath() + this.getOptions();
		
	},
	hasDescriptor: function(){
		
		if(this.descriptor) return true;
		return false;
		
	},
	loadDescriptor: function(baseUrl){
	
		var self = this;
		
		return new bluebird.Promise(function(res, rej){
				
			aja()
				.url(self.getDescriptorURL(baseUrl))
				.type('json')
				.on("success", function(data){
				
					self.descriptor = System.packagesDescriptor[self.fullPackageName] = data;
					res(data);
					
				})
				.on("error", function(err){
					
					rej(err);
					
				})
				.go();
			
		});
		
	},
	searchSatisfyingVersion: function(baseUrl){
		
		var self = this;
		
		return new bluebird.Promise(function(res, rej){
			
			// test regexp with already loaded packages
			if(typeof System.packagesDescriptor != "undefined"){
				
				for(var pkg in System.packagesDescriptor){
					
					var current = new Package(pkg);
					if(current.getName() == self.package.getName()){
						
						var currentVersion = current.getVersion();
						
						if(semver.satisfies(currentVersion, self.package.getVersion())){
							
							self.setVersion(currentVersion);
							res(currentVersion);
							return;
							
						}
						
					}
					
				}
				
			}
			
			self.askForSatisfyingVersion(baseUrl).then(res, rej);
			
		});
		
	},
	askForSatisfyingVersion: function(baseUrl){
		
		var self = this;
		
		return new bluebird.Promise(function(res, rej){
			
			var queryUrl = url.resolve(baseUrl, path.join("satisfy", self.package.getSerialized()));
			
			aja()
				.url(queryUrl)
				.type("jsonp")
				.on("success", function(version){
					
					if(version){
						self.setVersion(version);
						res(version);
					}else{
						rej(new Error("Version regexp not satisfied."));
					}
					
					
				})
				.on("error", function(xhr, textStatus, errorText){
					
					rej(new Error("Unknown error.", errorText));
					
				})
				.go();
			
		});
		
	},
	getRootPath: function(){
		
		return this.package.getName().replace(/\./g, "/") + "/@/" + this.package.getVersion();
		
	},
	getRootURL: function(baseUrl){
		
		if(!baseUrl.endsWith("/")) baseUrl += "/";
		return url.resolve(baseUrl, this.getRootPath());
		
	},
	getRootName: function(baseUrl){
		
		return this.getRootURL(baseUrl) + this.getOptions();
		
	},
	getDescriptorPath: function(){
		
		return path.join(this.getRootPath(), "package.json");
		
	},
	getDescriptorURL: function(baseUrl){
		
		if(!baseUrl.endsWith("/")) baseUrl += "/";
		return url.resolve(baseUrl, this.getDescriptorPath());
		
	},
	getMainPath: function(){
		
		var descriptor = this.getDescriptor();
		
		if(descriptor && _.isObject(descriptor)){
			return path.join(this.getRootPath(), descriptor.main);
		}
		
		throw new Error("You have to load the descriptor first.");
		
	},
	getMainURL: function(baseUrl){
		
		if(!baseUrl.endsWith("/")) baseUrl += "/";
		return url.resolve(baseUrl, this.getMainPath());
		
	},
	getMainName: function(baseUrl){
		
		return this.getMainURL(baseUrl) + this.getOptions();
		
	},
	getFullSourcePath: function(){
		
		return path.join(this.getRootPath(), this.sourcePath);
		
	},
	getFullSourceURL: function(baseUrl){
		
		if(!baseUrl.endsWith("/")) baseUrl += "/";
		return url.resolve(baseUrl, this.getFullSourcePath());
		
	},
	getFullSourceName: function(baseUrl){
		
		return this.getFullSourceURL(baseUrl) + this.getOptions();
		
	}
		
}

module.exports = Class;