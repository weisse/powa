const packageRegexp = /[\S]@[\S]/;

var semver = require("semver");
var _ = require("underscore");
	
var Class = function(name, major, minor, patch){
    
	var serialized = name;
	/*
	 * try to create the instance with only a serializedPackage string 
	 */
	try{
		
		this.set(serialized);
		
	}catch(error){
		
		/*
		 * try to set name and version separately
		 */
		this.setName(name);
		this.setVersion(major, minor, patch);
		
	}

};

Class.prototype = {
		
	hasActualVersion: function(){

        return semver.valid(this.version);

    },
    isValidPackage: function(){

        if(this.getName() && this.getVersion()){
            return true;
        }

        return false;

    },
    isActualPackage: function(){
    	
    	if(this.getName() && this.hasActualVersion()){
    		return true;
    	}
    	
    	return false;
    	
    },
    getName: function(){

        return this.name;

    },
    getVersion: function(){

        return this.version;

    },
    getSerialized: function(){

        return this.name + "@" + this.version;

    },
    setName: function(name){
    	
    	if(name && _.isString(name)){
    		
    		this.name = name;
    		
    	}else{
    		
    		throw new Error("You have to provide a valid name.");
    		
    	}
        

    },
    setVersion: function(major, minor, patch){
    	
    	if(major && _.isNumber(major) && minor && _.isNumber(minor) && patch && _.isNumber(patch)){
    		
    		this.version = major + "." + minor + "." + patch;
    		
    	}else{
    		
    		/*
        	 * try to set version only with a single string
        	 */
        	var version = major;
        	if(version && _.isString(version)){
        		
        		this.version = version;
        		return;
        		
        	}
        	
        	throw new Error("You have to provide a valid version.");
    		
    	}
        
    },
    set: function(packageName){

    	if(packageName && _.isString(packageName)){
    		
    		if(packageRegexp.test(packageName)){

                this.setName(packageName.split("@")[0]);
                this.setVersion(packageName.split("@")[1]);

            }else{
            	
            	throw new Error("An invalid package was provided.")
            	
            }
    		
    	}else{
    		
    		throw new Error("You have to provide a valid package.")
    		
    	}

    }
		
};

module.exports = Class;