System.config({
	
	baseURL: "/statics",
	meta: {
		
		"*.json": { loader: "json" },
		"*.css": { loader: "css" },
		"*.html": { loader: "text" }
		
	},
	paths: {
		
		"bootstrap": "./statics/js/bootstrap.js",
		"system-extensions": "./statics/js/system.extensions.js",
		
		// extensions
		"system-package-analyzation": "./statics/js/system-extensions/package-analyzation.js",
		"system-normalize": "./statics/js/system-extensions/normalize.js",
		"system-instantiate": "./statics/js/system-extensions/instantiate.js",
		
		// libs
		"Package": "./statics/js/libs/Package.js",
		"PowaPackage": "./statics/js/libs/PowaPackage.js",
		
		// plugins
		"text":"./statics/js/plugins/text.js",
		"css":"./statics/js/plugins/css.js",
		"json":"./statics/js/plugins/json.js",
		"img":"./statics/js/plugins/img.js",
		
		// utils
		"bluebird":"./statics/js/utils/bluebird.min.js",
		"semver":"./statics/js/utils/semver.min.js",
		"underscore":"./statics/js/utils/underscore.min.js",
		"aja":"./statics/js/utils/aja.min.js",
		"traceur":"./statics/js/utils/traceur.min.js",
		
		// node modules
		"assert": "./statics/js/node/assert.min.js",
		"buffer": "./statics/js/node/buffer.min.js",
		"console": "./statics/js/node/console.min.js",
		"constants": "./statics/js/node/constants.min.js",
		"crypto": "./statics/js/node/crypto.min.js",
		"domain": "./statics/js/node/domain.min.js",
		"events": "./statics/js/node/events.min.js",
		"http": "./statics/js/node/http.min.js",
		"https": "./statics/js/node/https.min.js",
		"os": "./statics/js/node/os.min.js",
		"path": "./statics/js/node/path.min.js",
		"process": "./statics/js/node/process.min.js",
		"punycode": "./statics/js/node/punycode.min.js",
		"querystring": "./statics/js/node/querystring.min.js",
		"stream": "./statics/js/node/stream.min.js",
		"string_decoder": "./statics/js/node/string_decoder.min.js",
		"timers": "./statics/js/node/timers.min.js",
		"tty": "./statics/js/node/tty.min.js",
		"url": "./statics/js/node/url.min.js",
		"util": "./statics/js/node/util.min.js",
		"vm": "./statics/js/node/vm.min.js",
		"zlib": "./statics/js/node/zlib.min.js"
		
	}

});