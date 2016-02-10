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
		"semver":"./statics/js/utils/semver.js",
		"underscore":"./statics/js/utils/underscore.min.js",
		"aja":"./statics/js/utils/aja.min.js",
		"traceur":"./statics/js/utils/traceur.min.js",
		
		// node modules
		"assert": "./statics/js/node/assert.js",
		"buffer": "./statics/js/node/buffer.js",
		"console": "./statics/js/node/console.js",
		"constants": "./statics/js/node/constants.js",
		"crypto": "./statics/js/node/crypto.js",
		"domain": "./statics/js/node/domain.js",
		"events": "./statics/js/node/events.js",
		"http": "./statics/js/node/http.js",
		"https": "./statics/js/node/https.js",
		"os": "./statics/js/node/os.js",
		"path": "./statics/js/node/path.js",
		"process": "./statics/js/node/process.js",
		"punycode": "./statics/js/node/punycode.js",
		"querystring": "./statics/js/node/querystring.js",
		"stream": "./statics/js/node/stream.js",
		"string_decoder": "./statics/js/node/string_decoder.js",
		"timers": "./statics/js/node/timers.js",
		"tty": "./statics/js/node/tty.js",
		"url": "./statics/js/node/url.js",
		"util": "./statics/js/node/util.js",
		"vm": "./statics/js/node/vm.js",
		"zlib": "./statics/js/node/zlib.js"
		
	}

});