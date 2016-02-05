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
    	.option("-F --configFile <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --httpsEnabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resumeWorker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-r --packageRootURL <packageRootURL>", "it defines the package root URL <default " + clientDefaults.packageRootURL + ">")
        .option("-m --mainPackage <mainPackage>", "it defines the package to get first as index <default " + clientDefaults.mainPackage + ">")
        .option("-b --openBrowser", "it chooses if open browser at start or not <default " + clientDefaults.openBrowser + ">")
    .action(function(options){

    	var config = _.extend(_.clone(commonDefaults), clientDefaults);

        // CHECK OPTIONS
        if(options.configFile) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
        if(options.host) config.host = options.host;
        if(options.port) config.port = options.port;
        if(options.httpsEnabled) config.httpsEnabled = !config.httpsEnabled;
		if(options.cluster) config.cluster = !config.cluster;
		if(options.workers) config.workers = options.workers;
		if(options.resumeWorker) config.resumeWorker = !config.resumeWorker;
        if(options.packageRootURL) config.packageRootURL = options.packageRootURL;
        if(options.mainPackage) config.mainPackage = options.mainPackage;
        if(options.openBrowser) config.openBrowser = !config.openBrowser;

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
    	.option("-F --configFile <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --httpsEnabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resumeWorker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-r --packageRootPath <packageRootPath>", "it defines the package root path <default " + serverDefaults.packageRootPath + ">")
        .option("--allowCors", "it defines if allow CORS or not <default " + serverDefaults.allowCors + ">")
        .option("--allowCredentials", "it defines if allow users to send cookies on CORS requests <default " + serverDefaults.allowCredentials + ">")
        .option("--allowedOrigin <allowedOrigin>", "it defines the allowed origins for CORS requests <default " + serverDefaults.allowedOrigin + ">")
        .option("--allowedHeaders <allowedHeaders>", "it defines the allowed headers for CORS requests <default " + serverDefaults.allowedHeaders + ">")
        .option("--allowedMethods <allowedMethods>", "it defines the allowed methods for CORS requests <default " + serverDefaults.allowedMethods + ">")
    .action(function(options){
    	
    	var config = _.extend(_.clone(commonDefaults), serverDefaults);

         // CHECK OPTIONS
         if(options.configFile) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
         if(options.host) config.host = options.host;
         if(options.port) config.port = options.port;
         if(options.httpsEnabled) config.httpsEnabled = !config.httpsEnabled;
         if(options.cluster) config.cluster = !config.cluster;
         if(options.workers) config.workers = options.workers;
         if(options.resumeWorker) config.resumeWorker = !config.resumeWorker;
         if(options.packageRootPath) config.packageRootPath = options.packageRootPath;
         if(options.allowCors) config.allowCors = !config.allowCors;
         if(options.allowCredentials) config.allowCredentials = !config.allowCredentials;
         if(options.allowedOrigin) config.allowedOrigin = options.allowedOrigin;
         if(options.allowedHeaders) config.allowedHeaders = options.allowedHeaders;
         if(options.allowedMethods) config.allowedMethods = options.allowedMethods;
         
         // RUN IT
         require(path.resolve(__dirname, "./server/main.js"))(config);

    });

program
	.command("bundle")
	.description("it does all things together")
		.option("-F --configFile <configFile>", "it defines the location of your configuration file")
    	.option("-H --host <host>", "it defines the allowed host <default " + commonDefaults.host + ">")
    	.option("-P --port <port>", "it defines the port number to listen <default " + commonDefaults.port + ">")
    	.option("-S --httpsEnabled", "it defines if https will be used <default " + commonDefaults.httpsEnabled + ">")
    	.option("-C, --cluster", "it activates cluster mode <default " + commonDefaults.cluster + ">")
        .option("-W --workers <workers>", "it defines the number of workers <default " + commonDefaults.workers + ">")
        .option("-R --resumeWorker", "it defines if resume died workers or not <default " + commonDefaults.resumeWorker + ">")
        .option("-m --mainPackage <mainPackage>", "it defines the package to get as index <default " + clientDefaults.mainPackage + ">")
        .option("-b --openBrowser", "it chooses if open browser at start or not <default " + clientDefaults.openBrowser + ">")
        .option("-r --packageRootPath <packageRootPath>", "it defines the package root path <default " + serverDefaults.packageRootPath + ">")
        .option("--allowCors", "it defines if allow CORS or not <default " + serverDefaults.allowCors + ">")
        .option("--allowCredentials", "it defines if allow users to send cookies on CORS requests <default " + serverDefaults.allowCredentials + ">")
        .option("--allowedOrigin <allowedOrigin>", "it defines the allowed origins for CORS requests <default " + serverDefaults.allowedOrigin + ">")
        .option("--allowedHeaders <allowedHeaders>", "it defines the allowed headers for CORS requests <default " + serverDefaults.allowedHeaders + ">")
        .option("--allowedMethods <allowedMethods>", "it defines the allowed methods for CORS requests <default " + serverDefaults.allowedMethods + ">")
    .action(function(options){
    	
    	var config = _.extend(_.clone(commonDefaults), _.extend(_.clone(serverDefaults), clientDefaults));
    		
         // CHECK OPTIONS
         if(options.configFile) config = _.extend(config, require(path.resolve(process.cwd(), options.configFile)) || {});
         if(options.host) config.host = options.host;
         if(options.port) config.port = options.port;
         if(options.httpsEnabled) config.httpsEnabled = !config.httpsEnabled;
         if(options.cluster) config.cluster = !config.cluster;
         if(options.workers) config.workers = options.workers;
         if(options.resumeWorker) config.resumeWorker = !config.resumeWorker;
         if(options.mainPackage) config.mainPackage = options.mainPackage;
         if(options.openBrowser) config.openBrowser = !config.openBrowser;
         if(options.packageRootPath) config.packageRootPath = options.packageRootPath;
         if(options.allowCors) config.allowCors = !config.allowCors;
         if(options.allowCredentials) config.allowCredentials = !config.allowCredentials;
         if(options.allowedOrigin) config.allowedOrigin = options.allowedOrigin;
         if(options.allowedHeaders) config.allowedHeaders = options.allowedHeaders;
         if(options.allowedMethods) config.allowedMethods = options.allowedMethods;
         
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