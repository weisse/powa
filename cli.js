#!/usr/bin/env node
var cluster = require("cluster");
var program = require("commander");
var path = require("path");
var url = require("url");
var open = require("open");
var pkg = require(path.join(__dirname, 'package.json'));
var _ = require("underscore");
var commonDefaults = require(path.resolve(__dirname, "./defaults/common.config.json"));
var clientDefaults = require(path.resolve(__dirname, "./defaults/client.config.json"));
var serverDefaults = require(path.resolve(__dirname, "./defaults/server.config.json"));

program
    .version(pkg.version)
    .usage("[command] [options]");

program
    .command("client")
    .description("it runs your awesome web application client")
    	.option("-F --config-file <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --https-enabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resume-worker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-O --show-options", "it defines if print options or not <default " + commonDefaults.showOptions + ">")
        .option("--master-http-log-port <masterHttpLogPort>", "it defines in which port master process has to listen to http-log  <default " + commonDefaults["master-http-log-port"] + ">")
        .option("--http-log", "it defines if stream http-log or not <default " + commonDefaults["http-log"] + ">")
        .option("--http-log-format <httpLogFormat>", "it defines in which format show http-log <default " + commonDefaults["http-log-format"] + ">")
        .option("--http-log-stream <httpLogStream>", "it defines in which stream write http-log  <default " + commonDefaults["http-log-stream"] + ">")
        .option("--master-error-log-port <masterErrorLogPort>", "it defines in which port master process has to listen to error-log  <default " + commonDefaults["master-error-log-port"] + ">")
        .option("--error-log-stream <errorLogStream>", "it defines in which stream write error-log  <default " + commonDefaults["error-log-stream"] + ">")
        .option("-u --package-root-url <packageRootUrl>", "it defines the package root URL <default " + clientDefaults.packageRootUrl + ">")
        .option("-m --main-package <mainPackage>", "it defines the package to get first as index <default " + clientDefaults.mainPackage + ">")
        .option("-b --open-browser", "it chooses if open browser at start or not <default " + clientDefaults.openBrowser + ">")
        // SPEEDY-STATIC-OPTIONS
        .option("--compression", "it defines if compress data or not <default " + commonDefaults.compression + ">")
        .option("--compression-level <compressionLevel>", "it defines the level of compression [0=BEST_SPEED, 1=DEFAULT_COMPRESSION, 2=BEST_COMPRESSION] <default " + commonDefaults["compression-level"] + ">")
        .option("--minify", "it defines if minify data or not <default " + commonDefaults.minify + ">")
        .option("--minify-mangle", "it defines if mangle minified data or not <default " + commonDefaults["minify-mangle"] + ">")
        .option("--etag", "it defines if send etag header or not <default " + commonDefaults.etag + ">")
        .option("--last-modified", "it defines if send last-modified header or not <default " + commonDefaults["last-modified"] + ">")
        .option("--content-type", "it defines if send content-type header or not <default " + commonDefaults["content-type"] + ">")
        .option("--max-cache-age <maxCacheAge>", "it defines the maximum server cache age <default " + commonDefaults["max-cache-age"] + ">")
        .option("--ignore-errors", "it defines if ignore errors and send a 404 or not <default " + commonDefaults["ignore-errors"] + ">")
        .option("--browser-cache", "it defines if take the advantage of browser cache or not <default " + commonDefaults["browser-cache"] + ">")
        .option("--browser-cache-max-age <browserCacheMaxAge>", "it defines the maximum browser cache age <default " + commonDefaults["browser-cache-max-age"] + ">")
        .option("--browser-cache-s-maxage <browserCacheSMaxage>", "it overrides the maximum browser cache age of proxies and CDNs <default " + commonDefaults["browser-cache-s-maxage"] + ">")
        .option("--prepare-cache", "it defines if prepare cache before listening to the port or not <default " + commonDefaults["prepare-cache"] + ">")
        .option("--hide-dotfiles", "it defines if hide dotfiles or not <default " + commonDefaults["hide-dotfiles"] + ">")
        .option("--ignore <ignore>", "it defines which file ignore <default " + commonDefaults["ignore"] + ">")
        .option("--ignore-regexp <ignoreRegExp>", "it defines which file ignore providing regular expressions <default " + commonDefaults["ignoreRegExp"] + ">")
    .action(function(options){

    	  var config = _.extend(_.clone(commonDefaults), clientDefaults);

        // CHECK OPTIONS
        if(!_.isUndefined(options.configFile)) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
        if(!_.isUndefined(options.host)) config.host = options.host;
        if(!_.isUndefined(options.port)) config.port = options.port;
        if(!_.isUndefined(options.httpsEnabled)) config.httpsEnabled = !config.httpsEnabled;
	    if(!_.isUndefined(options.cluster)) config.cluster = !config.cluster;
	    if(!_.isUndefined(options.workers)) config.workers = options.workers;
	    if(!_.isUndefined(options.resumeWorker)) config.resumeWorker = !config.resumeWorker;
	    if(!_.isUndefined(options.showOptions)) config.showOptions = !config.showOptions;
	    if(!_.isUndefined(options.masterHttpLogPort)) config["master-http-log-port"] = options.masterHttpLogPort;
	    if(!_.isUndefined(options.httpLog)) config["http-log"] = !config["http-log"];
        if(!_.isUndefined(options.httpLogFormat)) config["http-log-format"] = options.httpLogFormat;
        if(!_.isUndefined(options.httpLogStream)) config["http-log-stream"] = options.httpLogStream.split(",");
        if(!_.isUndefined(options.masterErrorLogPort)) config["master-error-log-port"] = options.masterErrorLogPort;
        if(!_.isUndefined(options.errorLogStream)) config["error-log-stream"] = options.errorLogStream.split(",");
        if(!_.isUndefined(options.packageRootUrl)) config.packageRootUrl = options.packageRootUrl;
        if(!_.isUndefined(options.mainPackage)) config.mainPackage = options.mainPackage;
        if(!_.isUndefined(options.openBrowser)) config.openBrowser = !config.openBrowser;
        // SPEEDY-STATIC OPTIONS
        if(!_.isUndefined(options.compression)) config.compression = !config.compression;
        if(!_.isUndefined(options.compressionLevel)) config["compression-level"] = options.compressionLevel;
        if(!_.isUndefined(options.minify)) config.minify = !config.minify;
        if(!_.isUndefined(options.minifyMangle)) config["minify-mangle"] = !config["minify-mangle"];
        if(!_.isUndefined(options.etag)) config.etag = !config.etag;
        if(!_.isUndefined(options.lastModified)) config["last-modified"] = !config["last-modified"];
        if(!_.isUndefined(options.contentType)) config["content-type"] = !config["content-type"];
        if(!_.isUndefined(options.maxCacheAge)) config["max-cache-age"] = options.maxCacheAge;
        if(!_.isUndefined(options.ignoreErrors)) config["ignore-errors"] = !config["ignore-errors"];
        if(!_.isUndefined(options.browserCache)) config["browser-cache"] = !config["browser-cache"];
        if(!_.isUndefined(options.browserCacheMaxAge)) config["browser-cache-max-age"] = options.browserCacheMaxAge;
        if(!_.isUndefined(options.browserCacheSMaxage)) config["browser-cache-s-maxage"] = options.browserCacheSMaxage;
        if(!_.isUndefined(options.prepareCache)) config["prepare-cache"] = !config["prepare-cache"];
        if(!_.isUndefined(options.hideDotfiles)) config["hide-dotfiles"] = !config["hide-dotfiles"];
        if(!_.isUndefined(options.ignore)) config["ignore"] = options.ignore.split(",");
        if(!_.isUndefined(options.ignoreRegexp)) config["ignoreRegExp"] = options.ignoreRegexp.split(",");

        var urlObj = {

         	hostname: config.host || commonDefaults.host,
         	port: config.port || commonDefaults.port,
         	protocol: config.httpsEnabled ? "https" : "http"

        };

        // RUN IT
        require(path.resolve(__dirname, "./client/main.js"))(config).then(function(){

        	if(config.openBrowser && cluster.isMaster) open(url.format(urlObj));

        });

    });

program
    .command("server")
    .description("it serves your fantastic web packages")
    	.option("-F --config-file <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --https-enabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resume-worker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-O --show-options", "it defines if print options or not <default " + commonDefaults.showOptions + ">")
        .option("--master-http-log-port <masterHttpLogPort>", "it defines in which port master process has to listen to http-log  <default " + commonDefaults["master-http-log-port"] + ">")
        .option("--http-log", "it defines if stream http-log or not <default " + commonDefaults["http-log"] + ">")
        .option("--http-log-format <httpLogFormat>", "it defines in which format show http-log <default " + commonDefaults["http-log-format"] + ">")
        .option("--http-log-stream <httpLogStream>", "it defines in which stream write http-log  <default " + commonDefaults["http-log-stream"] + ">")
        .option("--master-error-log-port <masterErrorLogPort>", "it defines in which port master process has to listen to error-log  <default " + commonDefaults["master-error-log-port"] + ">")
        .option("--error-log-stream <errorLogStream>", "it defines in which stream write error-log  <default " + commonDefaults["error-log-stream"] + ">")
        .option("-r --package-root-path <packageRootPath>", "it defines the package root path <default " + serverDefaults.packageRootPath + ">")
        .option("--allow-cors", "it defines if allow CORS or not <default " + serverDefaults.allowCors + ">")
        .option("--allow-credentials", "it defines if allow users to send cookies on CORS requests <default " + serverDefaults.allowCredentials + ">")
        .option("--allowed-origin <allowedOrigin>", "it defines the allowed origins for CORS requests <default " + serverDefaults.allowedOrigin + ">")
        .option("--allowed-headers <allowedHeaders>", "it defines the allowed headers for CORS requests <default " + serverDefaults.allowedHeaders + ">")
        .option("--allowed-methods <allowedMethods>", "it defines the allowed methods for CORS requests <default " + serverDefaults.allowedMethods + ">")
        // SPEEDY-STATIC-OPTIONS
        .option("--compression", "it defines if compress data or not <default " + commonDefaults.compression + ">")
        .option("--compression-level <compressionLevel>", "it defines the level of compression [0=BEST_SPEED, 1=DEFAULT_COMPRESSION, 2=BEST_COMPRESSION] <default " + commonDefaults["compression-level"] + ">")
        .option("--minify", "it defines if minify data or not <default " + commonDefaults.minify + ">")
        .option("--minify-mangle", "it defines if mangle minified data or not <default " + commonDefaults["minify-mangle"] + ">")
        .option("--etag", "it defines if send etag header or not <default " + commonDefaults.etag + ">")
        .option("--last-modified", "it defines if send last-modified header or not <default " + commonDefaults["last-modified"] + ">")
        .option("--content-type", "it defines if send content-type header or not <default " + commonDefaults["content-type"] + ">")
        .option("--max-cache-size <maxCacheSize>", "it defines the maximum server size in bytes <default " + serverDefaults["max-cache-size"] + ">")
        .option("--max-cache-age <maxCacheAge>", "it defines the maximum server cache age <default " + commonDefaults["max-cache-age"] + ">")
        .option("--ignore-errors", "it defines if ignore errors and send a 404 or not <default " + commonDefaults["ignore-errors"] + ">")
        .option("--browser-cache", "it defines if take the advantage of browser cache or not <default " + commonDefaults["browser-cache"] + ">")
        .option("--browser-cache-max-age <browserCacheMaxAge>", "it defines the maximum browser cache age <default " + commonDefaults["browser-cache-max-age"] + ">")
        .option("--browser-cache-s-maxage <browserCacheSMaxage>", "it overrides the maximum browser cache age of proxies and CDNs <default " + commonDefaults["browser-cache-s-maxage"] + ">")
        .option("--prepare-cache", "it defines if prepare cache before listening to the port or not <default " + commonDefaults["prepare-cache"] + ">")
        .option("--hide-dotfiles", "it defines if hide dotfiles or not <default " + commonDefaults["hide-dotfiles"] + ">")
        .option("--ignore <ignore>", "it defines which file ignore <default " + commonDefaults["ignore"] + ">")
        .option("--ignore-regexp <ignoreRegExp>", "it defines which file ignore providing regular expressions <default " + commonDefaults["ignoreRegExp"] + ">")
    .action(function(options){

    	var config = _.extend(_.clone(commonDefaults), serverDefaults);

         // CHECK OPTIONS
         if(!_.isUndefined(options.configFile)) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
         if(!_.isUndefined(options.host)) config.host = options.host;
         if(!_.isUndefined(options.port)) config.port = options.port;
         if(!_.isUndefined(options.httpsEnabled)) config.httpsEnabled = !config.httpsEnabled;
         if(!_.isUndefined(options.cluster)) config.cluster = !config.cluster;
         if(!_.isUndefined(options.workers)) config.workers = options.workers;
         if(!_.isUndefined(options.resumeWorker)) config.resumeWorker = !config.resumeWorker;
         if(!_.isUndefined(options.showOptions)) config.showOptions = !config.showOptions;
         if(!_.isUndefined(options.masterHttpLogPort)) config["master-http-log-port"] = options.masterHttpLogPort;
         if(!_.isUndefined(options.httpLog)) config["http-log"] = !config["http-log"];
         if(!_.isUndefined(options.httpLogFormat)) config["http-log-format"] = options.httpLogFormat;
         if(!_.isUndefined(options.httpLogStream)) config["http-log-stream"] = options.httpLogStream.split(",");
         if(!_.isUndefined(options.masterErrorLogPort)) config["master-error-log-port"] = options.masterErrorLogPort;
         if(!_.isUndefined(options.errorLogStream)) config["error-log-stream"] = options.errorLogStream.split(",");
         if(!_.isUndefined(options.packageRootPath)) config.packageRootPath = options.packageRootPath;
         if(!_.isUndefined(options.allowCors)) config.allowCors = !config.allowCors;
         if(!_.isUndefined(options.allowCredentials)) config.allowCredentials = !config.allowCredentials;
         if(!_.isUndefined(options.allowedOrigin)) config.allowedOrigin = options.allowedOrigin;
         if(!_.isUndefined(options.allowedHeaders)) config.allowedHeaders = options.allowedHeaders;
         if(!_.isUndefined(options.allowedMethods)) config.allowedMethods = options.allowedMethods;
         // SPEEDY-STATIC OPTIONS
         if(!_.isUndefined(options.compression)) config.compression = !config.compression;
         if(!_.isUndefined(options.compressionLevel)) config["compression-level"] = options.compressionLevel;
         if(!_.isUndefined(options.minify)) config.minify = !config.minify;
         if(!_.isUndefined(options.minifyMangle)) config["minify-mangle"] = !config["minify-mangle"];
         if(!_.isUndefined(options.etag)) config.etag = !config.etag;
         if(!_.isUndefined(options.lastModified)) config["last-modified"] = !config["last-modified"];
         if(!_.isUndefined(options.contentType)) config["content-type"] = !config["content-type"];
         if(!_.isUndefined(options.maxCacheSize)) config["max-cache-size"] = options.maxCacheSize;
         if(!_.isUndefined(options.maxCacheAge)) config["max-cache-age"] = options.maxCacheAge;
         if(!_.isUndefined(options.ignoreErrors)) config["ignore-errors"] = !config["ignore-errors"];
         if(!_.isUndefined(options.browserCache)) config["browser-cache"] = !config["browser-cache"];
         if(!_.isUndefined(options.browserCacheMaxAge)) config["browser-cache-max-age"] = options.browserCacheMaxAge;
         if(!_.isUndefined(options.browserCacheSMaxage)) config["browser-cache-s-maxage"] = options.browserCacheSMaxage;
         if(!_.isUndefined(options.prepareCache)) config["prepare-cache"] = !config["prepare-cache"];
         if(!_.isUndefined(options.hideDotfiles)) config["hide-dotfiles"] = !config["hide-dotfiles"];
         if(!_.isUndefined(options.ignore)) config["ignore"] = options.ignore.split(",");
         if(!_.isUndefined(options.ignoreRegexp)) config["ignoreRegExp"] = options.ignoreRegexp.split(",");

         // RUN IT
         require(path.resolve(__dirname, "./server/main.js"))(config);

    });

program
	.command("bundle")
	.description("it does all things together")
		.option("-F --config-file <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --https-enabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resume-worker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-O --show-options", "it defines if print options or not <default " + commonDefaults.showOptions + ">")
        .option("--master-http-log-port <masterHttpLogPort>", "it defines in which port master process has to listen to http-log  <default " + commonDefaults["master-http-log-port"] + ">")
        .option("--http-log", "it defines if stream http-log or not <default " + commonDefaults["http-log"] + ">")
        .option("--http-log-format <httpLogFormat>", "it defines in which format show http-log <default " + commonDefaults["http-log-format"] + ">")
        .option("--http-log-stream <httpLogStream>", "it defines in which stream write http-log  <default " + commonDefaults["http-log-stream"] + ">")
        .option("--master-error-log-port <masterErrorLogPort>", "it defines in which port master process has to listen to error-log  <default " + commonDefaults["master-error-log-port"] + ">")
        .option("--error-log-stream <errorLogStream>", "it defines in which stream write error-log  <default " + commonDefaults["error-log-stream"] + ">")
        .option("-u --package-root-url <packageRootUrl>", "it defines the package root URL <default this.HOST:this.PORT>")
        .option("-m --main-package <mainPackage>", "it defines the package to get as index <default " + clientDefaults.mainPackage + ">")
        .option("-b --open-browser", "it chooses if open browser at start or not <default " + clientDefaults.openBrowser + ">")
        .option("-r --package-root-path <packageRootPath>", "it defines the package root path <default " + serverDefaults.packageRootPath + ">")
        .option("--allow-cors", "it defines if allow CORS or not <default " + serverDefaults.allowCors + ">")
        .option("--allow-credentials", "it defines if allow users to send cookies on CORS requests <default " + serverDefaults.allowCredentials + ">")
        .option("--allowed-origin <allowedOrigin>", "it defines the allowed origins for CORS requests <default " + serverDefaults.allowedOrigin + ">")
        .option("--allowed-headers <allowedHeaders>", "it defines the allowed headers for CORS requests <default " + serverDefaults.allowedHeaders + ">")
        .option("--allowed-methods <allowedMethods>", "it defines the allowed methods for CORS requests <default " + serverDefaults.allowedMethods + ">")
        // SPEEDY-STATIC-OPTIONS
        .option("--compression", "it defines if compress data or not <default " + commonDefaults.compression + ">")
        .option("--compression-level <compressionLevel>", "it defines the level of compression [0=BEST_SPEED, 1=DEFAULT_COMPRESSION, 2=BEST_COMPRESSION] <default " + commonDefaults["compression-level"] + ">")
        .option("--minify", "it defines if minify data or not <default " + commonDefaults.minify + ">")
        .option("--minify-mangle", "it defines if mangle minified data or not <default " + commonDefaults["minify-mangle"] + ">")
        .option("--etag", "it defines if send etag header or not <default " + commonDefaults.etag + ">")
        .option("--last-modified", "it defines if send last-modified header or not <default " + commonDefaults["last-modified"] + ">")
        .option("--content-type", "it defines if send content-type header or not <default " + commonDefaults["content-type"] + ">")
        .option("--max-cache-size <maxCacheSize>", "it defines the maximum server size in bytes <default " + serverDefaults["max-cache-size"] + ">")
        .option("--max-cache-age <maxCacheAge>", "it defines the maximum server cache age <default " + commonDefaults["max-cache-age"] + ">")
        .option("--ignore-errors", "it defines if ignore errors and send a 404 or not <default " + commonDefaults["ignore-errors"] + ">")
        .option("--browser-cache", "it defines if take the advantage of browser cache or not <default " + commonDefaults["browser-cache"] + ">")
        .option("--browser-cache-max-age <browserCacheMaxAge>", "it defines the maximum browser cache age <default " + commonDefaults["browser-cache-max-age"] + ">")
        .option("--browser-cache-s-maxage <browserCacheSMaxage>", "it overrides the maximum browser cache age of proxies and CDNs <default " + commonDefaults["browser-cache-s-maxage"] + ">")
        .option("--prepare-cache", "it defines if prepare cache before listening to the port or not <default " + commonDefaults["prepare-cache"] + ">")
        .option("--hide-dotfiles", "it defines if hide dotfiles or not <default " + commonDefaults["hide-dotfiles"] + ">")
        .option("--ignore <ignore>", "it defines which file ignore <default " + commonDefaults["ignore"] + ">")
        .option("--ignore-regexp <ignoreRegExp>", "it defines which file ignore providing regular expressions <default " + commonDefaults["ignoreRegExp"] + ">")
    .action(function(options){

    	   var config = _.extend(_.clone(commonDefaults), _.extend(_.clone(serverDefaults), clientDefaults));

	       /* don't be sure of client default packageRootUrl */
	       config.packageRootUrl = null;

         // CHECK OPTIONS
         if(!_.isUndefined(options.configFile)) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
         if(!_.isUndefined(options.host)) config.host = options.host;
         if(!_.isUndefined(options.port)) config.port = options.port;
         if(!_.isUndefined(options.httpsEnabled)) config.httpsEnabled = !config.httpsEnabled;
         if(!_.isUndefined(options.cluster)) config.cluster = !config.cluster;
         if(!_.isUndefined(options.workers)) config.workers = options.workers;
         if(!_.isUndefined(options.resumeWorker)) config.resumeWorker = !config.resumeWorker;
         if(!_.isUndefined(options.masterHttpLogPort)) config["master-http-log-port"] = options.masterHttpLogPort;
         if(!_.isUndefined(options.httpLog)) config["http-log"] = !config["http-log"];
         if(!_.isUndefined(options.httpLogFormat)) config["http-log-format"] = options.httpLogFormat;
         if(!_.isUndefined(options.httpLogStream)) config["http-log-stream"] = options.httpLogStream.split(",");
         if(!_.isUndefined(options.masterErrorLogPort)) config["master-error-log-port"] = options.masterErrorLogPort;
         if(!_.isUndefined(options.errorLogStream)) config["error-log-stream"] = options.errorLogStream.split(",");
         if(!_.isUndefined(options.showOptions)) config.showOptions = !config.showOptions;
         if(!_.isUndefined(options.packageRootUrl)) config.packageRootUrl = options.packageRootUrl;
         if(!_.isUndefined(options.mainPackage)) config.mainPackage = options.mainPackage;
         if(!_.isUndefined(options.openBrowser)) config.openBrowser = !config.openBrowser;
         if(!_.isUndefined(options.packageRootPath)) config.packageRootPath = options.packageRootPath;
         if(!_.isUndefined(options.allowCors)) config.allowCors = !config.allowCors;
         if(!_.isUndefined(options.allowCredentials)) config.allowCredentials = !config.allowCredentials;
         if(!_.isUndefined(options.allowedOrigin)) config.allowedOrigin = options.allowedOrigin;
         if(!_.isUndefined(options.allowedHeaders)) config.allowedHeaders = options.allowedHeaders;
         if(!_.isUndefined(options.allowedMethods)) config.allowedMethods = options.allowedMethods;
         // SPEEDY-STATIC OPTIONS
         if(!_.isUndefined(options.compression)) config.compression = !config.compression;
         if(!_.isUndefined(options.compressionLevel)) config["compression-level"] = options.compressionLevel;
         if(!_.isUndefined(options.minify)) config.minify = !config.minify;
         if(!_.isUndefined(options.minifyMangle)) config["minify-mangle"] = !config["minify-mangle"];
         if(!_.isUndefined(options.etag)) config.etag = !config.etag;
         if(!_.isUndefined(options.lastModified)) config["last-modified"] = !config["last-modified"];
         if(!_.isUndefined(options.contentType)) config["content-type"] = !config["content-type"];
         if(!_.isUndefined(options.maxCacheSize)) config["max-cache-size"] = options.maxCacheSize;
         if(!_.isUndefined(options.maxCacheAge)) config["max-cache-age"] = options.maxCacheAge;
         if(!_.isUndefined(options.ignoreErrors)) config["ignore-errors"] = !config["ignore-errors"];
         if(!_.isUndefined(options.browserCache)) config["browser-cache"] = !config["browser-cache"];
         if(!_.isUndefined(options.browserCacheMaxAge)) config["browser-cache-max-age"] = options.browserCacheMaxAge;
         if(!_.isUndefined(options.browserCacheSMaxage)) config["browser-cache-s-maxage"] = options.browserCacheSMaxage;
         if(!_.isUndefined(options.prepareCache)) config["prepare-cache"] = !config["prepare-cache"];
         if(!_.isUndefined(options.hideDotfiles)) config["hide-dotfiles"] = !config["hide-dotfiles"];
         if(!_.isUndefined(options.ignore)) config["ignore"] = options.ignore.split(",");
         if(!_.isUndefined(options.ignoreRegexp)) config["ignoreRegExp"] = options.ignoreRegexp.split(",");

         var urlObj = {

         	hostname: config.host || commonDefaults.host,
         	port: config.port || commonDefaults.port,
         	protocol: config.httpsEnabled ? "https" : "http"

         };

         // RUN IT
         require(path.resolve(__dirname, "./bundle/main.js"))(config).then(function(){

        	 if(config.openBrowser && cluster.isMaster) open(url.format(urlObj));

         });

    });

// PARSE ARGV
program.parse(process.argv);
