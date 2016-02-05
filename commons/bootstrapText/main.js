var fs = require("fs");
var path = require("path");
var logoPath = path.join(__dirname, "text");

module.exports = function(){
	
	var logo = fs.readFileSync(logoPath, "utf8");
	console.log(logo);
	
}
