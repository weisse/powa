const CliTable = require("cli-table");
const _ = require("underscore");

module.exports = function(options){
	
	var table = new CliTable({
		
		head: ["OPTION", "VALUE"]
		
	}); 
	
	for(var attr in options){
		var value = options[attr];
		if(_.isNull(value)) value = "null";
		table.push([attr, value]);
	}
	
	console.log(table.toString());
	
}